'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const root = process.cwd();
const outputPath = path.join(root, 'test-results.json');
const child = spawn(process.execPath, [path.join(root, 'scripts', 'load-node-tests.cjs')], {
  cwd: root,
  env: {
    ...process.env,
    NO_COLOR: '1',
    TS_NODE_PROJECT: process.env.TS_NODE_PROJECT ?? 'tsconfig.spec.json',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let stdout = '';
let stderr = '';

child.stdout.on('data', chunk => {
  const text = chunk.toString();
  stdout += text;
  process.stdout.write(text);
});

child.stderr.on('data', chunk => {
  const text = chunk.toString();
  stderr += text;
  process.stderr.write(text);
});

child.on('close', code => {
  const results = parseTestOutput(stdout);

  if (results.stats.tests === 0 && stderr.trim()) {
    results.failures.push({
      title: 'test runner failed before reporting tests',
      fullTitle: 'test runner failed before reporting tests',
      duration: 0,
      file: 'test runner',
      error: stderr.trim(),
    });
    results.stats.failures = 1;
  }

  fs.writeFileSync(outputPath, `${JSON.stringify(results, null, 2)}\n`);
  process.exitCode = code ?? 1;
});

function parseTestOutput(output) {
  const passes = [];
  const failures = [];
  const pending = [];
  const suites = [];
  const suiteTestCounts = new Map();
  const stats = {
    suites: 0,
    tests: 0,
    passes: 0,
    failures: 0,
    pending: 0,
    cancelled: 0,
    duration: 0,
  };
  let currentSuite = 'node:test';
  let lastTimedEntry;

  for (const line of output.split(/\r?\n/)) {
    const suiteStart = line.match(/^\s*▶\s+(.+)$/u);
    if (suiteStart) {
      currentSuite = suiteStart[1].trim();
      continue;
    }

    const tapSuiteStart = line.match(/^(\s*)#\s+Subtest:\s+(.+)$/u);
    if (tapSuiteStart && tapSuiteStart[1].length === 0) {
      currentSuite = tapSuiteStart[2].trim();
      continue;
    }

    const info = line.match(/^\s*(?:ℹ|#)\s+(tests|suites|pass|fail|cancelled|skipped|todo|duration_ms)\s+([\d.]+)$/u);
    if (info) {
      applyInfo(stats, info[1], Number(info[2]));
      continue;
    }

    const timedResult = line.match(/^(\s*)(✔|✖)\s+(.+?)\s+\(([\d.]+)(µs|ms|s)\)$/u);
    if (timedResult) {
      const [, indent, marker, name, rawDuration, unit] = timedResult;
      const duration = toMilliseconds(Number(rawDuration), unit);

      if (indent.length === 0) {
        suites.push({
          name,
          file: name,
          duration,
          testCount: suiteTestCounts.get(name) ?? 0,
        });
        lastTimedEntry = suites.at(-1);
        currentSuite = name;
        continue;
      }

      const target = marker === '✔' ? passes : failures;
      target.push({
        title: name,
        fullTitle: currentSuite ? `${currentSuite} ${name}` : name,
        duration,
        file: currentSuite,
      });
      lastTimedEntry = target.at(-1);
      suiteTestCounts.set(currentSuite, (suiteTestCounts.get(currentSuite) ?? 0) + 1);
      continue;
    }

    const tapResult = line.match(/^(\s*)(ok|not ok)\s+\d+\s+-\s+(.+)$/u);
    if (tapResult) {
      const [, indent, marker, rawName] = tapResult;
      const name = stripTapDirective(rawName);

      if (indent.length === 0) {
        suites.push({
          name,
          file: name,
          duration: 0,
          testCount: suiteTestCounts.get(name) ?? 0,
        });
        lastTimedEntry = suites.at(-1);
        currentSuite = name;
        continue;
      }

      const target = marker === 'ok' ? passes : failures;
      target.push({
        title: name,
        fullTitle: currentSuite ? `${currentSuite} ${name}` : name,
        duration: 0,
        file: currentSuite,
      });
      lastTimedEntry = target.at(-1);
      suiteTestCounts.set(currentSuite, (suiteTestCounts.get(currentSuite) ?? 0) + 1);
      continue;
    }

    const tapDuration = line.match(/^\s*duration_ms:\s*([\d.]+)$/u);
    if (tapDuration && lastTimedEntry) {
      lastTimedEntry.duration = Math.round(Number(tapDuration[1]));
      continue;
    }

    const skipped = line.match(/^(\s*)(﹣|-)\s+(.+?)(?:\s+#\s+(SKIP|TODO).*)?$/u);
    if (skipped && skipped[1].length > 0) {
      const name = skipped[3].trim();
      pending.push({
        title: name,
        fullTitle: currentSuite ? `${currentSuite} ${name}` : name,
        duration: 0,
        file: currentSuite,
      });
      suiteTestCounts.set(currentSuite, (suiteTestCounts.get(currentSuite) ?? 0) + 1);
    }
  }

  for (const suite of suites) {
    suite.testCount = suiteTestCounts.get(suite.name) ?? suite.testCount;
  }

  stats.passes ||= passes.length;
  stats.failures ||= failures.length;
  stats.pending ||= pending.length;
  stats.tests ||= stats.passes + stats.failures + stats.pending + stats.cancelled;
  stats.suites ||= suites.length;

  return {
    stats,
    suites,
    passes,
    failures,
    pending,
  };
}

function applyInfo(stats, key, value) {
  const map = {
    tests: 'tests',
    suites: 'suites',
    pass: 'passes',
    fail: 'failures',
    cancelled: 'cancelled',
    skipped: 'pending',
    todo: 'pending',
    duration_ms: 'duration',
  };
  const target = map[key];
  if (!target) {
    return;
  }

  if (key === 'todo') {
    stats.pending += value;
    return;
  }

  stats[target] = value;
}

function toMilliseconds(value, unit) {
  if (unit === 's') {
    return Math.round(value * 1000);
  }
  if (unit === 'µs') {
    return Math.round(value / 1000);
  }
  return Math.round(value);
}

function stripTapDirective(value) {
  return value.replace(/\s+#\s+(?:SKIP|TODO).*/u, '').trim();
}
