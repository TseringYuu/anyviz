'use strict';

const fs = require('fs');
const path = require('path');

const root = __dirname;

function readJson(relativePath) {
  const absolutePath = path.join(root, relativePath);
  return JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
}

/** @type {import('./index').AnyvizPackage} */
module.exports = {
  root,
  version: require('./package.json').version,
  skillPath: path.join(root, 'SKILL.md'),
  resolve: (subpath) => path.join(root, subpath),
  defaultTheme: () => readJson('aesthetics/default.json'),
  themes: {
    modern: () => readJson('aesthetics/themes/modern.json'),
    analytics: () => readJson('aesthetics/themes/analytics.json'),
    dashboard: () => readJson('aesthetics/themes/dashboard.json'),
    academic: () => readJson('aesthetics/themes/academic.json'),
  },
};
