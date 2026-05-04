// Posts a coverage comparison comment on PRs.
// Called from ci.yml via actions/github-script.

module.exports = async ({ github, context, core }) => {
  const fs = require('fs');

  const current = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8'));
  const hasBase = fs.existsSync('base-coverage-summary.json');
  const base = hasBase ? JSON.parse(fs.readFileSync('base-coverage-summary.json', 'utf8')) : null;
  const changedFiles = fs.existsSync('changed-files.txt')
    ? fs.readFileSync('changed-files.txt', 'utf8').trim().split('\n').filter(Boolean)
    : [];

  const bar = pct => {
    const filled = Math.round(pct / 5);
    return '\u2588'.repeat(filled) + '\u2591'.repeat(20 - filled);
  };

  const fmt = metric => `\`${metric.covered}/${metric.total}\` (${metric.pct}%)`;

  const diffStr = (currentPct, basePct) => {
    const diff = (currentPct - basePct).toFixed(2);
    if (diff > 0) {
      return `🟢 +${diff}%`;
    }
    if (diff < 0) {
      return `🔴 ${diff}%`;
    }
    return '⚪ 0%';
  };

  const capitalize = value => value.charAt(0).toUpperCase() + value.slice(1);

  const overallPct = current.total.statements.pct;
  const badgeColor = overallPct >= 80 ? 'brightgreen' : overallPct >= 60 ? 'yellow' : 'red';
  const badge = `![Coverage](https://img.shields.io/badge/coverage-${overallPct}%25-${badgeColor})`;
  const metrics = ['statements', 'branches', 'functions', 'lines'];

  const totalRows = metrics.map(metric => {
    const currentMetric = current.total[metric];
    const currentBar = `\`${bar(currentMetric.pct)}\``;

    if (base) {
      const baseMetric = base.total[metric];
      return `| ${capitalize(metric)} | ${currentBar} | ${fmt(currentMetric)} | ${fmt(baseMetric)} | ${diffStr(currentMetric.pct, baseMetric.pct)} |`;
    }

    return `| ${capitalize(metric)} | ${currentBar} | ${fmt(currentMetric)} | - | - |`;
  });

  const fileRows = [];
  for (const file of changedFiles) {
    const currentKey = Object.keys(current).find(key => key !== 'total' && key.endsWith(file));
    if (!currentKey) {
      continue;
    }

    const currentFile = current[currentKey];
    const baseKey = base ? Object.keys(base).find(key => key !== 'total' && key.endsWith(file)) : null;
    const baseFile = baseKey ? base[baseKey] : null;
    const statementBar = `\`${bar(currentFile.statements.pct)}\``;
    const diff = baseFile ? diffStr(currentFile.statements.pct, baseFile.statements.pct) : '🆕 new';

    fileRows.push(
      `| \`${file.replace(/^packages\//, '')}\` | ${statementBar} | ${fmt(currentFile.statements)} | ${fmt(currentFile.branches)} | ${diff} |`,
    );
  }

  const sections = [
    '<!-- coverage-report -->',
    `## 📊 ${badge} Coverage Report`,
    '',
    '| Metric | | PR | Base | Diff |',
    '| --- | --- | ---: | ---: | ---: |',
    ...totalRows,
  ];

  if (fileRows.length > 0) {
    sections.push(
      '',
      '<details>',
      '<summary><strong>🧾 Changed files</strong></summary>',
      '',
      '| File | | Statements | Branches | Diff |',
      '| --- | --- | ---: | ---: | ---: |',
      ...fileRows,
      '',
      '</details>',
    );
  }

  sections.push(
    '',
    '---',
    `<sub>Updated for [\`${context.sha.slice(0, 7)}\`](${context.payload.repository.html_url}/commit/${context.sha}) | ${base ? 'Compared against base branch' : 'No base coverage cached yet - will compare after first merge to base'}</sub>`,
  );

  const body = sections.join('\n');
  const { data: comments } = await github.rest.issues.listComments({
    ...context.repo,
    issue_number: context.issue.number,
  });
  const existing = comments.find(comment => comment.body?.includes('<!-- coverage-report -->'));

  if (existing) {
    await github.rest.issues.updateComment({ ...context.repo, comment_id: existing.id, body });
  } else {
    await github.rest.issues.createComment({ ...context.repo, issue_number: context.issue.number, body });
  }

  if (base) {
    const dropped = metrics.filter(metric => current.total[metric].pct < base.total[metric].pct);
    if (dropped.length > 0) {
      core.setFailed(`Coverage dropped in: ${dropped.join(', ')}`);
    }
  }
};
