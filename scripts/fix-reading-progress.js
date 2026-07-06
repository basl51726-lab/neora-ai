/**
 * Adds reading-progress bar to compare detail pages missing it.
 */
const fs = require('fs');
const path = require('path');

const compareDir = path.join(__dirname, '..', 'compare');
let n = 0;

for (const d of fs.readdirSync(compareDir)) {
  const file = path.join(compareDir, d, 'index.html');
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('reading-progress') || !html.includes('compare-detail')) continue;
  html = html.replace(/(<\/nav>\s*\r?\n)/i, '$1\n<div id="reading-progress"></div>\n');
  fs.writeFileSync(file, html, 'utf8');
  console.log('added reading-progress:', `compare/${d}/index.html`);
  n++;
}

console.log('Done.', n, 'files updated.');
