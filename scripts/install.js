#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || process.env.USERPROFILE;
const SKILL_DIR = path.join(HOME, '.claude', 'skills', 'meta-skill');

const FILES_TO_COPY = [
  'SKILL.md',
  'HEARTBEAT.md',
  'skill.json',
  'references/session-schema.md',
  'references/post-types.md'
];

// Find package root (where skill.json lives)
const pkgRoot = path.resolve(__dirname, '..');

console.log(`Installing meta-skill to ${SKILL_DIR}...`);

// Create directories
fs.mkdirSync(path.join(SKILL_DIR, 'references'), { recursive: true });

// Copy files
for (const file of FILES_TO_COPY) {
  const src = path.join(pkgRoot, file);
  const dest = path.join(SKILL_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  Copied ${file}`);
  } else {
    console.warn(`  Warning: ${file} not found in package`);
  }
}

console.log('Meta-skill installed successfully!');
