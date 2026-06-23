// scripts/preflight.js
// Neora AI – Preflight validation check

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

let errors = [];
let warnings = [];

function exists(filePath) {
  if (!filePath) return true;
  const clean = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  return fs.existsSync(clean);
}

function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function checkCollection(pattern, type) {
  const files = glob.sync(pattern);

  files.forEach(file => {
    try {
      const raw = fs.readFileSync(file, 'utf8').trimStart();
      const { data } = matter(raw);

      if (data.published === false) return;

      const title = data.title || data.name;
      const slug = data.slug || path.basename(file, '.md');

      if (!title) {
        errors.push(`${file}: missing title/name`);
      }

      if (type !== 'tool' && !data.date) {
        errors.push(`${file}: missing date`);
      }

      if (type !== 'post' && slug && !isValidSlug(slug)) {
        errors.push(`${file}: invalid slug "${slug}"`);
      }

      if (data.image && !exists(data.image)) {
        errors.push(`${file}: missing image "${data.image}"`);
      }

      if (!data.description && !data.desc_ar && !data.desc_en) {
        warnings.push(`${file}: missing description`);
      }
    } catch (err) {
      errors.push(`${file}: ${err.message}`);
    }
  });
}

console.log('\n🔍 Neora AI – Preflight Check\n');

checkCollection('_posts/**/*.md', 'post');
checkCollection('_comparisons/**/*.md', 'comparison');
checkCollection('_tools/**/*.md', 'tool');

if (warnings.length) {
  console.log('⚠️ Warnings:');
  warnings.forEach(w => console.log(`- ${w}`));
  console.log('');
}

if (errors.length) {
  console.error('❌ Preflight failed:\n');
  errors.forEach(e => console.error(`- ${e}`));
  process.exit(1);
}

console.log('✅ Preflight passed. Ready to build.\n');
