// scripts/build.js
// Neora AI – Safe publishing build pipeline

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

const BASE_URL = 'https://neora-ai.com';
const OUT_DIR = '_posts-json';
const SITEMAP = 'public/sitemap.xml';

let errors = [];

function fileExists(filePath) {
  if (!filePath) return true;
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  return fs.existsSync(cleanPath);
}

function validateItem(item, type) {
  const file = item._file || 'unknown file';

  // Tools قد تستخدم name بدل title
  if (!item.title && item.name) {
    item.title = item.name;
  }

  // إذا لا يوجد slug، نأخذه من اسم الملف تلقائياً
  if (!item.slug) {
    item.slug = path.basename(file, '.md');
  }

  if (!item.title) {
    errors.push(`${file}: missing title`);
  }

  // التاريخ مطلوب للمقالات والمقارنات فقط، وليس الأدوات
  if (type !== 'tool' && !item.date) {
    errors.push(`${file}: missing date`);
  }

  if (item.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
    errors.push(`${file}: invalid slug "${item.slug}"`);
  }

  if (item.image && !fileExists(item.image)) {
    errors.push(`${file}: image not found "${item.image}"`);
  }

  item.type = type;
  return item;
}

function readFolder(pattern, type) {
  const files = glob.sync(pattern);

  return files
    .map(f => {
      try {
        const { data, content } = matter(fs.readFileSync(f, 'utf8'));
        return validateItem({ ...data, _content: content, _file: f }, type);
      } catch (e) {
        errors.push(`${f}: ${e.message}`);
        return null;
      }
    })
    .filter(d => d && d.published !== false && d.slug)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

function checkDuplicateSlugs(items) {
  const seen = new Map();

  items.forEach(item => {
    const key = `${item.type}:${item.slug}`;
    if (seen.has(key)) {
      errors.push(`Duplicate slug: ${key} in ${item._file} and ${seen.get(key)}`);
    } else {
      seen.set(key, item._file);
    }
  });
}

function strip(arr) {
  return arr.map(({ _content, _file, ...rest }) => rest);
}

function writeJSON(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`  ✅ ${filePath}`);
}

function toUrl(loc, date, priority = '0.7', changefreq = 'monthly') {
  const lastmod = date ?? new Date().toISOString().slice(0, 10);
  return [
    '  <url>',
    `    <loc>${BASE_URL}${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <priority>${priority}</priority>`,
    `    <changefreq>${changefreq}</changefreq>`,
    '  </url>',
  ].join('\n');
}

function buildSitemap(posts, tools, comparisons) {
  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/blog', priority: '0.9', changefreq: 'weekly' },
    { loc: '/compare', priority: '0.9', changefreq: 'weekly' },
    { loc: '/tool', priority: '0.8', changefreq: 'weekly' },
    { loc: '/about', priority: '0.6', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.5', changefreq: 'monthly' },
  ];

  const urls = [
    ...staticPages.map(p => toUrl(p.loc, null, p.priority, p.changefreq)),
    ...posts.map(p => toUrl(`/blog/${p.slug}`, p.date, p.featured ? '0.9' : '0.7')),
    ...tools.map(t => toUrl(`/tool/${t.slug}`, t.date, '0.7')),
    ...comparisons.map(c => toUrl(`/compare/${c.slug}`, c.date, c.featured ? '0.9' : '0.8')),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n');

  fs.mkdirSync(path.dirname(SITEMAP), { recursive: true });
  fs.writeFileSync(SITEMAP, xml, 'utf8');
  console.log(`  ✅ ${SITEMAP} (${urls.length} URLs)`);
}

async function build() {
  console.log('\n🔨 Neora AI – Build started\n');

  const posts = readFolder('_posts/**/*.md', 'post');
  const tools = readFolder('_tools/**/*.md', 'tool');
  const comparisons = readFolder('_comparisons/**/*.md', 'comparison');

  checkDuplicateSlugs([...posts, ...tools, ...comparisons]);

  if (errors.length > 0) {
    console.error('\n❌ Build stopped. Fix these issues:\n');
    errors.forEach(e => console.error(`- ${e}`));
    process.exit(1);
  }

  console.log('📂 Generating JSON indexes...');
  writeJSON(`${OUT_DIR}/posts-index.json`, { posts: strip(posts) });
  writeJSON(`${OUT_DIR}/tools-index.json`, { tools: strip(tools) });
  writeJSON(`${OUT_DIR}/compare-index.json`, { comparisons: strip(comparisons) });
  writeJSON(`${OUT_DIR}/search-index.json`, {
    items: strip([...posts, ...tools, ...comparisons]),
  });

  console.log('\n🗺️ Generating sitemap...');
  buildSitemap(posts, tools, comparisons);

  console.log(
    `\n✨ Done — Posts: ${posts.length} | Tools: ${tools.length} | Comparisons: ${comparisons.length}\n`
  );
}

build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
