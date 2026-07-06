const fs = require('fs');
const path = require('path');

const fontBlock = `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">`;

function walk(dir, list = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory() && !f.startsWith('.') && f !== 'node_modules') {
      walk(p, list);
    } else if (f.endsWith('.html')) {
      list.push(p);
    }
  }
  return list;
}

let n = 0;
for (const file of walk('.')) {
  if (file.includes('node_modules') || file.endsWith('index-preview.html')) continue;
  let h = fs.readFileSync(file, 'utf8');
  if (!h.includes('/assets/css/main.css') && !h.includes('/assets/css/homepage.css')) continue;
  if (h.includes('family=Cairo')) continue;
  h = h.replace('</head>', fontBlock + '\n</head>');
  fs.writeFileSync(file, h);
  n++;
}
console.log('Added fonts to', n, 'files');
