// Posts a node:test performance comparison comment on PRs.
// Called from ci.yml via actions/github-script.

module.exports = async ({ github, context }) => {
  const fs = require('fs');

  const results = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
  const stepDurationMs = parseInt(fs.readFileSync('test-step-duration-ms.txt', 'utf8').trim(), 10);
  const hasBase = fs.existsSync('base-test-results.json');
  const baseResults = hasBase ? JSON.parse(fs.readFileSync('base-test-results.json', 'utf8')) : null;
  const baseStepDurationMs = fs.existsSync('base-test-step-duration-ms.txt')
    ? parseInt(fs.readFileSync('base-test-step-duration-ms.txt', 'utf8').trim(), 10)
    : null;

  const fmtMilliseconds = ms => `${Math.round(ms)}ms`;
  const fmtDuration = ms => (ms >= 1000 ? `**${(ms / 1000).toFixed(2)}s**` : fmtMilliseconds(ms));
  const fmtDiff = (currentMs, baseMs) => {
    if (baseMs == null) {
      return '-';
    }
    const diffMs = currentMs - baseMs;
    if (Math.abs(diffMs) < 50) {
      return '⚪ ~0';
    }
    const sign = diffMs > 0 ? '+' : '';
    const icon = diffMs > 0 ? '🔴' : '🟢';
    return Math.abs(diffMs) >= 1000
      ? `${icon} ${sign}${(diffMs / 1000).toFixed(2)}s`
      : `${icon} ${sign}${fmtMilliseconds(diffMs)}`;
  };
  const suiteKey = value => value.split('/').slice(-3).join('/');
  const escapeCell = value => String(value).replace(/\|/g, '\\|');

  const baseSuites = new Map(
    (baseResults?.suites ?? []).map(suite => [suiteKey(suite.name), suite]),
  );
  const suites = (results.suites ?? [])
    .map(suite => ({
      ...suite,
      name: suiteKey(suite.name),
      baseDuration: baseSuites.get(suiteKey(suite.name))?.duration ?? null,
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);

  const suiteRows = suites.map((suite, index) => {
    return `| ${index + 1} | \`${escapeCell(suite.name)}\` | ${suite.testCount ?? 0} | ${fmtDuration(suite.duration)} | ${fmtDiff(suite.duration, suite.baseDuration)} |`;
  });

  const baseTests = new Map(
    [...(baseResults?.passes ?? []), ...(baseResults?.failures ?? [])].map(test => [
      test.fullTitle,
      test.duration ?? 0,
    ]),
  );
  const tests = [...(results.passes ?? []), ...(results.failures ?? [])]
    .map(test => ({
      suite: test.file || 'node:test',
      name: test.fullTitle || test.title,
      duration: test.duration || 0,
      baseDuration: baseTests.has(test.fullTitle) ? baseTests.get(test.fullTitle) : null,
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 15);

  const testRows = tests.map((test, index) => {
    return `| ${index + 1} | \`${escapeCell(test.suite)}\` | ${escapeCell(test.name)} | ${fmtDuration(test.duration)} | ${fmtDiff(test.duration, test.baseDuration)} |`;
  });

  const stats = results.stats;
  const baseTotalTestTime = baseResults?.stats?.duration ?? null;
  const sections = [
    '<!-- test-performance-report -->',
    '## ⏱️ Performance Report',
    '',
    '| | |',
    '| --- | --- |',
    `| **✅ Tests** | ${stats.passes} passed, ${stats.failures} failed, ${stats.pending} skipped |`,
    `| **🧪 Suites** | ${stats.suites} |`,
    `| **⏱️ Total step time** | ${fmtDuration(stepDurationMs)} ${baseStepDurationMs != null ? fmtDiff(stepDurationMs, baseStepDurationMs) : ''} |`,
    `| **⚙️ Test execution** | ${fmtDuration(stats.duration)} ${baseTotalTestTime != null ? fmtDiff(stats.duration, baseTotalTestTime) : ''} |`,
    '',
    '<details>',
    '<summary><strong>🐢 Slowest test suites</strong></summary>',
    '',
    '| # | Suite | Tests | Duration | vs Base |',
    '| --- | --- | ---: | ---: | ---: |',
    ...(suiteRows.length > 0 ? suiteRows : ['| - | - | 0 | 0ms | - |']),
    '',
    '</details>',
    '',
    '<details>',
    '<summary><strong>🐌 Slowest individual tests</strong></summary>',
    '',
    '| # | Suite | Test | Duration | vs Base |',
    '| --- | --- | --- | ---: | ---: |',
    ...(testRows.length > 0 ? testRows : ['| - | - | - | 0ms | - |']),
    '',
    '</details>',
    '',
    '---',
    `<sub>Updated for [\`${context.sha.slice(0, 7)}\`](${context.payload.repository.html_url}/commit/${context.sha}) | ${hasBase ? 'Compared against base branch' : 'No base data cached yet - will compare after first merge to base'}</sub>`,
  ];

  const body = sections.join('\n');
  const { data: comments } = await github.rest.issues.listComments({
    ...context.repo,
    issue_number: context.issue.number,
  });
  const existing = comments.find(comment => comment.body?.includes('<!-- test-performance-report -->'));

  if (existing) {
    await github.rest.issues.updateComment({ ...context.repo, comment_id: existing.id, body });
  } else {
    await github.rest.issues.createComment({ ...context.repo, issue_number: context.issue.number, body });
  }
};
