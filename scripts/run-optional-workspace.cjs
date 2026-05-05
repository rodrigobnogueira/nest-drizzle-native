const { existsSync, readdirSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');

const [, , workspaceName, scriptName] = process.argv;

if (!workspaceName || !scriptName) {
  console.error('Usage: node scripts/run-optional-workspace.cjs <workspace> <script>');
  process.exit(1);
}

const workspacePath = findWorkspacePath(workspaceName);

if (!workspacePath) {
  console.log(`Skipping ${workspaceName}: workspace is not present yet.`);
  process.exit(0);
}

const result = spawnSync(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['run', scriptName, '--workspace', workspaceName],
  {
    stdio: 'inherit',
  },
);

process.exit(result.status ?? 1);

function findWorkspacePath(name) {
  const samplePackagePath = join(process.cwd(), 'sample');

  if (!existsSync(samplePackagePath)) {
    return undefined;
  }

  return readdirSync(samplePackagePath, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => join(samplePackagePath, entry.name, 'package.json'))
    .find(packagePath => packageHasName(packagePath, name));
}

function packageHasName(packagePath, name) {
  if (!existsSync(packagePath)) {
    return false;
  }

  const samplePackage = JSON.parse(readFileSync(packagePath, 'utf8'));
  return samplePackage.name === name;
}
