const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COMPARE_DIR = path.join(ROOT, 'compare');
const CSS_LINK = '  <link rel="stylesheet" href="/assets/css/content-pages.css">';

function stripMarkdownFences(content) {
  let c = content.trim();
  if (c.startsWith('```html')) c = c.slice('```html'.length).trimStart();
  if (c.endsWith('```')) c = c.slice(0, -3).trimEnd();
  return c;
}

function addCssLink(content) {
  if (content.includes('content-pages.css')) return content;
  return content.replace(
    '<link rel="stylesheet" href="/assets/css/main.css">',
    '<link rel="stylesheet" href="/assets/css/main.css">\n' + CSS_LINK
  );
}

function updateBodyClass(content) {
  if (content.includes('compare-detail')) {
    return content.replace(/<body[^>]*>/, '<body class="content-page compare-detail">');
  }
  return content.replace(/<body>/, '<body class="content-page compare-detail">');
}

function removeLegacyHeader(content) {
  return content.replace(/<header>\s*<a class="logo" href="\/">[\s\S]*?<\/header>\s*/g, '');
}

function restructureCardType(content) {
  if (!content.includes('<main class="container">')) return content;
  if (content.includes('class="container compare-content"')) return content;

  content = content.replace(
    /<section class="hero">\s*\n\s*(?:<div class="badge">|<span class="badge">)/,
    '<main class="page-main">\n<header class="inner-hero compare-hero">\n  <div class="page-badge">'
  );
  content = content.replace(
    /<\/section>\s*\n\s*<main class="container">/,
    '</header>\n\n<div class="container compare-content">'
  );
  content = content.replace(
    /<\/main>\s*\n\s*\n\s*<footer class="footer"/,
    '</div>\n</main>\n\n  <footer class="footer"'
  );
  return content;
}

function fixPageLayout(content) {
  return content.replace('<main class="page">', '<main class="page-main compare-page-layout">');
}

function fixDynamicCompare(content) {
  if (!content.includes('id="comparison-page"')) return content;

  content = content.replace(/\s*<div id="site-header"><\/div>\s*/g, '\n');
  content = content.replace(/\s*<div id="site-footer"><\/div>\s*/g, '\n');

  content = content.replace(
    '<main id="comparison-page">',
    '<main id="comparison-page" class="page-main compare-dynamic">'
  );

  content = content.replace(
    '<h1 style="color:#e2e8f0;font-size:1.6rem;margin:0 0 0.5rem">${c.title}</h1>',
    '<h1>${c.title}</h1>'
  );
  content = content.replace(
    '<p style="color:#94a3b8;margin:0">${c.description}</p>',
    '<p>${c.description}</p>'
  );

  return content;
}

function fixComparePage(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  content = stripMarkdownFences(content);
  content = addCssLink(content);
  content = updateBodyClass(content);
  content = removeLegacyHeader(content);
  content = restructureCardType(content);
  content = fixPageLayout(content);
  content = fixDynamicCompare(content);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

const entries = fs.readdirSync(COMPARE_DIR, { withFileTypes: true });
const updated = [];

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const indexPath = path.join(COMPARE_DIR, entry.name, 'index.html');
  if (!fs.existsSync(indexPath)) continue;
  if (fixComparePage(indexPath)) updated.push(path.relative(ROOT, indexPath));
}

console.log('Updated compare pages:', updated.length);
updated.forEach((f) => console.log(' ', f));
