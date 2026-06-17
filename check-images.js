#!/usr/bin/env node
/**
 * Neora AI – Image Validation Script
 * Run before every deployment: node check-images.js
 * Reports all pages with missing or broken image references.
 */

const fs   = require('fs');
const path = require('path');

const ROOT        = process.cwd();           // repo root
const IMAGE_DIR   = path.join(ROOT, 'assets', 'images');
const REPORT_FILE = path.join(ROOT, 'image-report.txt');

// ── Collect all HTML / MD files ──────────────────────────────────────────────
function walk(dir, exts = ['.html', '.md'], results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && !['node_modules', '.git', 'assets'].includes(entry.name)) {
      walk(full, exts, results);
    } else if (entry.isFile() && exts.includes(path.extname(entry.name))) {
      results.push(full);
    }
  }
  return results;
}

// ── Extract image src values ──────────────────────────────────────────────────
function extractImages(content) {
  const found = [];
  // HTML: <img src="...">
  const htmlRe = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = htmlRe.exec(content)) !== null) found.push(m[1]);
  // Markdown: ![alt](src)
  const mdRe = /!\[[^\]]*\]\(([^)]+)\)/g;
  while ((m = mdRe.exec(content)) !== null) found.push(m[1]);
  return found;
}

// ── Resolve absolute path from /assets/images/... src ────────────────────────
function resolveSrc(src) {
  if (src.startsWith('/assets/images/')) {
    return path.join(ROOT, src);
  }
  return null; // external or non-standard (flagged separately)
}

// ── Main ──────────────────────────────────────────────────────────────────────
function main() {
  const files  = walk(ROOT);
  const errors = [];
  const warns  = [];
  let   ok     = 0;

  for (const file of files) {
    const content  = fs.readFileSync(file, 'utf8');
    const images   = extractImages(content);
    const relFile  = path.relative(ROOT, file);

    for (const src of images) {
      // Skip external URLs
      if (src.startsWith('http://') || src.startsWith('https://')) continue;

      // Flag non-standard paths
      if (!src.startsWith('/assets/images/')) {
        warns.push(`⚠  NON-STANDARD PATH\n   File : ${relFile}\n   Src  : ${src}\n   Fix  : use /assets/images/... absolute path\n`);
        continue;
      }

      const abs = resolveSrc(src);
      if (!fs.existsSync(abs)) {
        errors.push(`✗  MISSING IMAGE\n   File : ${relFile}\n   Src  : ${src}\n   Abs  : ${path.relative(ROOT, abs)}\n`);
      } else {
        ok++;
      }
    }
  }

  // ── Report ────────────────────────────────────────────────────────────────
  const lines = [];
  lines.push('═══════════════════════════════════════════');
  lines.push('  Neora AI – Image Validation Report');
  lines.push(`  ${new Date().toISOString()}`);
  lines.push('═══════════════════════════════════════════\n');

  if (errors.length === 0 && warns.length === 0) {
    lines.push(`✓ All ${ok} image references are valid.\n`);
  } else {
    lines.push(`Summary: ${ok} OK  |  ${errors.length} MISSING  |  ${warns.length} NON-STANDARD\n`);

    if (errors.length) {
      lines.push('── MISSING FILES (must fix before deploy) ──');
      errors.forEach(e => lines.push(e));
    }
    if (warns.length) {
      lines.push('── NON-STANDARD PATHS (should fix) ─────────');
      warns.forEach(w => lines.push(w));
    }
  }

  const report = lines.join('\n');
  console.log(report);
  fs.writeFileSync(REPORT_FILE, report);

  // Exit with error code if missing images found (blocks CI/CD)
  if (errors.length > 0) {
    console.error(`\n🚫 Deploy blocked: ${errors.length} missing image(s). Fix them first.\n`);
    process.exit(1);
  }
}

main();
