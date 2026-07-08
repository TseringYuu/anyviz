'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const anyviz = require('..');

assert.ok(anyviz.guides, 'anyviz.guides should be exposed');

const expectedGuides = {
  academicPublication: 'guides/academic-publication.md',
  legendLayout: 'guides/legend-layout.md',
  consistencyRules: 'guides/consistency-rules.md',
};

for (const [key, relativePath] of Object.entries(expectedGuides)) {
  const expectedPath = path.join(anyviz.root, relativePath);
  assert.strictEqual(anyviz.guides[key], expectedPath, `${key} should resolve to ${relativePath}`);
  assert.ok(fs.existsSync(anyviz.guides[key]), `${key} guide should exist on disk`);
}

console.log('anyviz package exports verified');
