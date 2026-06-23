// scripts/build.js
// Neora AI – Single-source build pipeline
// Reads: _posts/, _tools/, _comparisons/
// Writes: _posts-json/posts-index.json
//         _posts-json/tools-index.json
//         _posts-json/compare-index.json
//         _posts-json/search-index.json
//         public/sitemap.xml

import fs   from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

const BASE_URL  = 'https://neora-ai.com';
const OUT_DIR   = '_posts-json';
const SITEMAP   = 'public/sitemap.xml';

// ── helpers ────────────────────────────────────────────────

function readFolder(pattern) {
  const files = glob.sync(pattern);
  return files
    .map(f => {
      try {
        const { data, content } = matter(fs.readFileSync(f, 'utf8'));
        return { ...data, _content: content, _file: f };
      } catch (e) {
        console.warn(`⚠️  Skipping ${f}: ${e.message}`);
        return null;
      }
    })
    .filter(d => d && d.published !== false && d.slug)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function strip(arr) {
  // Remove heavy fields not needed in index JSON
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

// ── sitemap ────────────────────────────────────────────────

function buildSitemap(posts, tools, comparisons) {
  const staticPages = [
    { loc: '/',         priority: '1.0', changefreq: 'weekly'  },
    { loc: '/blog',     priority: '0.9', changefreq: 'weekly'  },
    { loc: '/compare',  priority: '0.9', changefreq: 'weekly'  },
    { loc: '/tool',     priority: '0.8', changefreq: 'weekly'  },
    { loc: '/about',    priority: '0.6', changefreq: 'monthly' },
    { loc: '/contact',  priority: '0.5', changefreq: 'monthly' },
  ];

  const urls = [
    ...staticPages.map(p => toUrl(p.loc, null, p.priority, p.changefreq)),
    ...posts.map(p =>
      toUrl(`/blog/${p.slug}`, p.date, p.featured ? '0.9' : '0.7')),
    ...tools.map(t =>
      toUrl(`/tool/${t.slug}`, t.date, '0.7')),
    ...comparisons.map(c =>
      toUrl(`/compare/${c.slug}`, c.date, c.featured ? '0.9' : '0.8')),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n');

  fs.mkdirSync(path.dirname(SITEMAP), { recursive: true });
  fs.writeFileSync(SITEMAP, xml, 'utf8');
  console.log(`  ✅ ${SITEMAP}  (${urls.length} URLs)`);
}

// ── main ───────────────────────────────────────────────────

async function build() {
  console.log('\n🔨 Neora AI – Build started\n');

  const posts       = readFolder('_posts/**/*.md');
  const tools       = readFolder('_tools/**/*.md');
  const comparisons = readFolder('_comparisons/**/*.md');

  console.log('📂 Generating JSON indexes...');
  writeJSON(`${OUT_DIR}/posts-index.json`,   { posts:       strip(posts)       });
  writeJSON(`${OUT_DIR}/tools-index.json`,   { tools:       strip(tools)       });
  writeJSON(`${OUT_DIR}/compare-index.json`, { comparisons: strip(comparisons) });
  writeJSON(`${OUT_DIR}/search-index.json`,  {
    items: strip([...posts, ...tools, ...comparisons]),
  });

  console.log('\n🗺️  Generating sitemap...');
  buildSitemap(posts, tools, comparisons);

  console.log(`\n✨ Done — Posts: ${posts.length} | Tools: ${tools.length} | Comparisons: ${comparisons.length}\n`);
}

build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
