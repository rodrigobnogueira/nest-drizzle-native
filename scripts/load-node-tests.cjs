'use strict';

const fs = require('node:fs');
const path = require('node:path');

process.env.TS_NODE_PROJECT ??= 'tsconfig.spec.json';

require('ts-node/register');
require('reflect-metadata');

const testDirectory = path.join(process.cwd(), 'packages', 'drizzle', 'test');
const files = fs
  .readdirSync(testDirectory)
  .filter(file => file.endsWith('.spec.ts'))
  .sort();

for (const file of files) {
  require(path.join(testDirectory, file));
}
