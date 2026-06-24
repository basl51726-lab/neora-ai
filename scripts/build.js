// scripts/build.js
// Neora AI — safe publishing build pipeline

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

const BASE_URL = 'https://neora-ai.com';
const OUT_DIR = '_posts-json';
const ROOT_POSTS_INDEX = 'posts-index.json';
const ROOT_TOOLS_INDEX = 'tools-index.json';
const ROOT_SITEMAP = 'sitemap.xml';

let errors = [];
let warnings = [];

function fileExists(filePath) {
  if (!filePath) return true;
  if (/^https?:\/\//i.test(filePath)) return true;
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  return fs.existsSync(cleanPath);
}

function slugFromFile(file) {
  return path.basename(file, path.extname(file));
}

function normalizeSlug(value, file, type) {
  const slug = String(value || slugFromFile(file)).trim();
  if (type !== 'post' && slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push(`${file}: invalid slug "${slug}"`);
  }
  return slug;
}

function normalizeItem(data, content, file, type) {
  const item = { ...data };

  item._file = file;
  item._content = content.trim();
  item.type = type;

  if (!item.title && item.name) item.title = item.name;
  item.slug = normalizeSlug(item.slug, file, type);

  if (!item.title) errors.push(`${file}: missing title/name`);
  if (type !== 'tool' && !item.date) errors.push(`${file}: missing date`);
  if (item.image && !fileExists(item.image)) errors.push(`${file}: image not found "${item.image}"`);

  // Keep frontend compatibility with existing pages.
  if (type === 'tool') {
    item.id = item.id || item.slug;
    item.name = item.name || item.title;
    item.cat = item.cat || item.category || 'chat';
    item.desc_ar = item.desc_ar || item.description || '';
    item.desc_en = item.desc_en || item.description || '';
    item.stars = String(item.stars || item.rating || '4.5');
    item.url = item.affiliate_url || item.url || '#';
    item.body = item.body || item._content || '';
  }

  if (type === 'post') {
    item.description = item.description || item.excerpt || '';
    item.body = item.body || item._content || '';
  }

  return item;
}

function readFolder(pattern, type) {
  const files = glob.sync(pattern, { nodir: true }).sort();

  return files
    .map(file => {
      try {
        const raw = fs.readFileSync(file, 'utf8').trimStart();
        const { data, content } = matter(raw);
        const item = normalizeItem(data, content, file, type);
        return item.published === false ? null : item;
      } catch (err) {
        errors.push(`${file}: ${err.message}`);
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

function checkDuplicateSlugs(items) {
  const seen = new Map();
  for (const item of items) {
    const key = `${item.type}:${item.slug}`;
    if (seen.has(key)) errors.push(`Duplicate slug: ${key} in ${item._file} and ${seen.get(key)}`);
    else seen.set(key, item._file);
  }
}

function strip(arr, includeContent = false) {
  return arr.map(({ _content, _file, ...rest }) => includeContent ? { ...rest, body: rest.body || _content || '' } : rest);
}

function writeJSON(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`  ✅ ${filePath}`);
}

function escapeXml(s) {
  return String(s).replace(/[<>&'\"]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;', '"':'&quot;' }[c]));
}

function toUrl(loc, date, priority = '0.7', changefreq = 'monthly') {
  const lastmod = date ? String(date).slice(0, 10) : new Date().toISOString().slice(0, 10);
  return [
    '  <url>',
    `    <loc>${escapeXml(BASE_URL + loc)}</loc>`,
    `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
    `    <priority>${priority}</priority>`,
    `    <changefreq>${changefreq}</changefreq>`,
    '  </url>',
  ].join('\n');
}

function buildSitemap(posts, tools, comparisons) {
  const compareDirs = fs.existsSync('compare')
    ? fs.readdirSync('compare').filter(d => fs.existsSync(path.join('compare', d, 'index.html')) && d !== 'template')
    : [];

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/blog/', priority: '0.9', changefreq: 'weekly' },
    { loc: '/compare/', priority: '0.9', changefreq: 'weekly' },
    { loc: '/tool/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/about/', priority: '0.6', changefreq: 'monthly' },
    { loc: '/contact/', priority: '0.5', changefreq: 'monthly' },
  ];

  const comparisonSlugs = new Set(comparisons.map(c => c.slug));
  compareDirs.forEach(slug => comparisonSlugs.add(slug));

  const urls = [
    ...staticPages.map(p => toUrl(p.loc, null, p.priority, p.changefreq)),
    ...posts.map(p => toUrl(`/blog/${encodeURIComponent(p.slug)}`, p.date, p.featured ? '0.9' : '0.7')),
    ...tools.map(t => toUrl(`/tool/${encodeURIComponent(t.slug || t.id)}`, t.date, '0.7')),
    ...Array.from(comparisonSlugs).sort().map(slug => toUrl(`/compare/${encodeURIComponent(slug)}/`, null, '0.8')),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');

  fs.writeFileSync(ROOT_SITEMAP, xml, 'utf8');
  fs.mkdirSync('public', { recursive: true });
  fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
  console.log(`  ✅ ${ROOT_SITEMAP} (${urls.length} URLs)`);
  console.log('  ✅ public/sitemap.xml');
}

async function build() {
  console.log('\n🔨 Neora AI – Build started\n');

  const posts = readFolder('_posts/**/*.md', 'post');
  const tools = readFolder('_tools/**/*.md', 'tool');
  const comparisons = readFolder('_comparisons/**/*.md', 'comparison');

  checkDuplicateSlugs([...posts, ...tools, ...comparisons]);

  if (warnings.length) {
    console.log('\n⚠️ Warnings:');
    warnings.forEach(w => console.log(`- ${w}`));
  }

  if (errors.length > 0) {
    console.error('\n❌ Build stopped. Fix these issues:\n');
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
  }

  console.log('📂 Generating JSON indexes...');

  // Root files are used by the current frontend.
  writeJSON(ROOT_POSTS_INDEX, strip(posts));
  writeJSON(ROOT_TOOLS_INDEX, strip(tools));

  // _posts-json files are used by article pages and comparison templates.
  writeJSON(`${OUT_DIR}/posts-index.json`, { posts: strip(posts) });
  writeJSON(`${OUT_DIR}/tools-index.json`, { tools: strip(tools) });
  writeJSON(`${OUT_DIR}/compare-index.json`, { comparisons: strip(comparisons) });
  writeJSON(`${OUT_DIR}/search-index.json`, { items: strip([...posts, ...tools, ...comparisons]) });

  for (const post of posts) {
    writeJSON(`${OUT_DIR}/${post.slug}.json`, { ...post, content: post._content || post.body || '' });
  }

  console.log('\n🗺️ Generating sitemap...');
  buildSitemap(posts, tools, comparisons);

  console.log(`\n✨ Done — Posts: ${posts.length} | Tools: ${tools.length} | Comparisons: ${comparisons.length}\n`);
}

build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
