/**
 * Builds assets/css/pages.css from content-pages + blog-listing + inner-page styles.
 * Run: node scripts/build-pages-css.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CSS = path.join(ROOT, 'assets/css');

function blueify(src) {
  return src
    .replace(/var\(--gold-dark\)/g, 'var(--blue-dark)')
    .replace(/var\(--gold-light\)/g, 'var(--blue-light)')
    .replace(/var\(--gold-border\)/g, 'rgba(59,130,246,.28)')
    .replace(/var\(--gold\)/g, 'var(--blue)')
    .replace(/rgba\(212,166,74,/g, 'rgba(59,130,246,')
    .replace(/#f5ecd5/g, 'var(--blue-light)')
    .replace(/#EDD68A/g, 'rgba(59,130,246,.28)');
}

const innerExtras = `
/* =================================================================
   Neora AI — pages.css
   Inner pages: extends homepage.css design tokens & components
   ================================================================= */

.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

/* --- Shared page hero (listings + static) --- */
.page-hero-bar {
  border-bottom: 1px solid var(--gray-100);
  background: var(--bg);
  padding: 48px 40px 40px;
  text-align: center;
}

.page-hero-bar .hero-h {
  font-size: clamp(28px, 4vw, 40px);
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

.page-hero-bar .hero-p {
  max-width: 560px;
  margin-left: auto;
  margin-right: auto;
}

.page-hero-bar .hbadge { margin-bottom: 16px; }

/* --- Controls (search + filters) --- */
.page-controls {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 28px 40px 0;
}

.page-controls .search-area {
  max-width: 560px;
  margin: 0 auto 18px;
}

.page-filters {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.page-filters .pp {
  cursor: pointer;
  border: none;
  font-family: var(--font);
}

.page-filters .pp.active {
  background: linear-gradient(135deg, var(--blue), var(--purple));
  color: #fff;
  border-color: transparent;
}

/* --- Layout containers --- */
.page-main { flex: 1; }

.container {
  width: 100%;
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 40px;
}

.container-narrow {
  width: 100%;
  max-width: var(--content-w);
  margin: 0 auto;
  padding: 0 24px;
}

.page-wrap {
  padding-top: 32px;
  padding-bottom: 80px;
}

.content-wrap {
  padding-bottom: 80px;
}

.listing-sec {
  padding-top: 32px;
  padding-bottom: 64px;
}

.listing-count {
  font-size: 12px;
  font-weight: 700;
  color: var(--gray-400);
  margin-bottom: 18px;
}

.listing-count span {
  color: var(--blue-dark);
}

/* --- Breadcrumb --- */
.breadcrumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 12px;
  color: var(--gray-400);
  margin-bottom: 20px;
}

.breadcrumb a {
  color: var(--blue-dark);
  font-weight: 600;
  text-decoration: none;
}

.breadcrumb a:hover { text-decoration: underline; }

/* --- Generic cards (compare detail, static) --- */
.card,
.about-card,
.value-item {
  background: var(--bg);
  border: 1.5px solid var(--gray-100);
  border-radius: var(--radius-xl);
  padding: 24px;
  margin-bottom: 16px;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.card:hover,
.about-card:hover {
  border-color: rgba(59,130,246,.35);
  box-shadow: 0 6px 24px rgba(59,130,246,.08);
}

.card h2,
.about-card h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 12px;
}

.card h3 { font-size: 15px; font-weight: 700; margin: 16px 0 8px; }

.small-card {
  background: var(--bg-subtle);
  border: 1px solid var(--gray-100);
  border-radius: var(--radius-lg);
  padding: 16px;
}

.grid {
  display: grid;
  gap: 16px;
}

.grid-tools {
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.compare-hub-grid,
.comp-grid-list {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

/* --- Tools listing cards (tool-pill style) --- */
.tool-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: var(--bg);
  border: 1.5px solid var(--gray-100);
  border-radius: 14px;
  padding: 20px 12px 16px;
  text-decoration: none;
  text-align: center;
  transition: border-color var(--transition), box-shadow var(--transition);
}

.tool-card:hover {
  border-color: var(--blue);
  box-shadow: 0 4px 16px rgba(59,130,246,.12);
}

.tool-card .tool-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 100px;
}

[dir="rtl"] .tool-card .tool-badge { left: auto; right: 10px; }

.tool-card .tool-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--blue-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  overflow: hidden;
}

.tool-card .tool-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.tool-card .tool-name {
  font-size: 13px;
  font-weight: 800;
  color: var(--gray-900);
}

.tool-card .tool-cat {
  font-size: 10px;
  color: var(--gray-300);
}

.tool-card .tool-pricing {
  font-size: 11px;
  color: var(--blue-dark);
  font-weight: 700;
  margin-top: 2px;
}

.badge-free { background: var(--green-light); color: var(--green-dark); border: 1px solid rgba(16,185,129,.25); }
.badge-pro { background: var(--blue-light); color: var(--blue-dark); border: 1px solid rgba(59,130,246,.25); }
.badge-new { background: rgba(139,92,246,.1); color: var(--purple-dark); border: 1px solid rgba(139,92,246,.25); }

/* --- Compare hub cards (ccard style) --- */
a.comp-card,
.comp-card {
  background: var(--bg);
  border: 1.5px solid var(--gray-100);
  border-radius: var(--radius-lg);
  padding: 20px 18px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  transition: border-color var(--transition), box-shadow var(--transition);
}

a.comp-card:hover,
.comp-card:hover {
  border-color: var(--purple);
  box-shadow: 0 6px 20px rgba(139,92,246,.12);
}

a.comp-card h2,
.comp-card h2 {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--gray-900);
}

a.comp-card p,
.comp-card p {
  font-size: 13px;
  color: var(--gray-500);
  line-height: 1.65;
  margin-bottom: 14px;
  flex: 1;
}

.comp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.comp-tags .tag {
  font-size: 10px;
  font-weight: 700;
  color: var(--blue-dark);
  background: var(--blue-light);
  border-radius: 5px;
  padding: 2px 8px;
}

.comp-card-link {
  font-size: 12px;
  font-weight: 700;
  color: var(--purple-dark);
  margin-top: auto;
}

/* --- Tool detail --- */
.tool-hero {
  background: var(--bg);
  border: 1.5px solid var(--gray-100);
  border-radius: var(--radius-xl);
  padding: 28px;
  margin-bottom: 20px;
}

.tool-hero-top {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.tool-icon-wrap {
  width: 68px;
  height: 68px;
  border-radius: 14px;
  background: var(--blue-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 28px;
}

.tool-icon-wrap img { width: 44px; height: 44px; object-fit: contain; }

.tool-badges { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; }

.badge-tier {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 100px;
  text-transform: uppercase;
}

.tool-name {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 6px;
}

.tool-cat-tag {
  font-size: 11px;
  font-weight: 700;
  color: var(--gray-500);
  background: var(--gray-50);
  border: 1px solid var(--gray-100);
  padding: 3px 10px;
  border-radius: 100px;
}

.tool-stars { font-size: 14px; color: var(--blue); font-weight: 700; }

.tool-desc-text {
  color: var(--gray-700);
  line-height: 1.75;
  margin-bottom: 16px;
}

.tool-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, var(--blue), var(--purple));
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: opacity var(--transition);
}

.btn-primary:hover { opacity: .92; }

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg);
  color: var(--gray-900);
  font-size: 13px;
  font-weight: 700;
  padding: 10px 20px;
  border-radius: 10px;
  border: 1.5px solid var(--gray-100);
  cursor: pointer;
  text-decoration: none;
  transition: border-color var(--transition);
}

.btn-secondary:hover { border-color: var(--blue); }

.tool-content {
  font-size: 1.02rem;
  line-height: 1.8;
  color: var(--gray-700);
}

.tool-content h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 2rem 0 0.75rem;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--gray-100);
}

.tool-content h3 { font-size: 1.05rem; font-weight: 700; margin: 1.5rem 0 0.5rem; }

.tool-content a { color: var(--blue-dark); font-weight: 600; }

.tool-sidebar {
  background: var(--bg-subtle);
  border: 1px solid var(--gray-100);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-top: 24px;
}

.tool-sidebar h3 {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 12px;
}

.tool-sidebar li {
  font-size: 13px;
  color: var(--gray-700);
  margin-bottom: 6px;
}

/* --- Static / about pages --- */
.about-card .icon { margin-left: 6px; }

.about-card a { color: var(--blue-dark); font-weight: 600; }

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.value-item {
  padding: 16px;
  margin-bottom: 0;
}

.value-item b {
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
}

.value-item span {
  font-size: 12px;
  color: var(--gray-500);
  line-height: 1.6;
}

.contact-form label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 6px;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  font-family: var(--font);
  font-size: 14px;
  padding: 10px 14px;
  border: 1.5px solid var(--gray-100);
  border-radius: 10px;
  margin-bottom: 14px;
  background: var(--bg);
}

.contact-form input:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: var(--blue);
}

.legal-content {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--gray-700);
}

.legal-content h2 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 2rem 0 0.75rem;
}

.legal-content ul { padding-right: 1.25rem; margin-bottom: 1rem; }

[dir="ltr"] .legal-content ul { padding-right: 0; padding-left: 1.25rem; }

/* --- Prose (shared) --- */
.prose a,
.post-body a,
.tool-content a,
.compare-content a {
  color: var(--blue-dark);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: rgba(59,130,246,.25);
  text-underline-offset: 3px;
}

.prose blockquote,
.post-body blockquote {
  border-right: 3px solid var(--blue);
  padding: 12px 16px;
  margin: 1.5rem 0;
  background: var(--bg-subtle);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

[dir="ltr"] .prose blockquote,
[dir="ltr"] .post-body blockquote {
  border-right: none;
  border-left: 3px solid var(--blue);
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

.prose code,
.post-body code {
  background: var(--gray-50);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: .9em;
}

.prose pre,
.post-body pre {
  background: var(--gray-900);
  color: #f5f5f5;
  padding: 16px;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: 1rem 0;
}

.prose table,
.post-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 14px;
}

.prose th,
.post-body th {
  background: var(--gray-50);
  padding: 10px 12px;
  text-align: right;
  border-bottom: 2px solid var(--gray-100);
}

[dir="ltr"] .prose th,
[dir="ltr"] .post-body th { text-align: left; }

.prose td,
.post-body td {
  padding: 9px 12px;
  border-bottom: 1px solid var(--gray-100);
}

/* --- Post footer actions --- */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--blue-dark);
  font-weight: 700;
  font-size: 13px;
  padding: 9px 16px;
  border-radius: 10px;
  border: 1.5px solid rgba(59,130,246,.28);
  background: var(--blue-light);
  transition: background var(--transition);
  text-decoration: none;
}

.back-btn:hover { background: rgba(59,130,246,.15); }

.share-btn {
  font-size: 12px;
  color: var(--gray-500);
  background: var(--gray-50);
  border: 1.5px solid var(--gray-100);
  padding: 7px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  transition: border-color var(--transition);
}

.share-btn:hover {
  border-color: var(--blue);
  color: var(--blue-dark);
}

.post-footer {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

/* --- Loading / error states --- */
.loading,
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--gray-400);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--gray-100);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: page-spin .8s linear infinite;
  margin: 0 auto 16px;
}

@keyframes page-spin { to { transform: rotate(360deg); } }

.error-box {
  text-align: center;
  padding: 60px 20px;
}

.error-box h2 { margin-bottom: 12px; }

.error-box a {
  color: var(--blue-dark);
  font-weight: 700;
}

.compare-detail .container.compare-content {
  max-width: var(--content-w);
  margin: 0 auto;
  padding: 0 24px 80px;
}

.inner-hero.page-hero,
.inner-hero {
  border-bottom: 1px solid var(--gray-100);
  background: var(--bg);
  padding: 48px 40px 40px;
  text-align: center;
}

.inner-hero h1,
.inner-hero .hero-h {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 12px;
}

.inner-hero h1 em { font-style: normal; color: var(--blue); }

.inner-hero p {
  max-width: 560px;
  margin: 0 auto;
  color: var(--gray-500);
  line-height: 1.7;
}

.page-badge,
.inner-hero .hbadge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--blue-light);
  color: var(--blue-dark);
  border: 1px solid rgba(59,130,246,.2);
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 14px;
  margin-bottom: 16px;
}

@media (max-width: 1024px) {
  .page-hero-bar,
  .inner-hero { padding: 40px 24px 32px; }
  .page-controls,
  .container { padding-left: 24px; padding-right: 24px; }
}

.compare-detail .inner-hero.compare-hero {
  border-bottom: 1px solid var(--gray-100);
  background: var(--bg);
  padding: 48px 40px 40px;
  text-align: center;
  max-width: none;
  margin: 0;
}

.compare-detail .inner-hero.compare-hero h1 {
  font-size: clamp(26px, 4vw, 38px);
  font-weight: 700;
  line-height: 1.25;
  margin-bottom: 12px;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
}

.compare-detail .inner-hero.compare-hero p {
  color: var(--gray-500);
  line-height: 1.7;
  max-width: 640px;
  margin: 0 auto;
}

.compare-detail .inner-hero.compare-hero .page-badge {
  display: inline-flex;
  align-items: center;
  background: var(--blue-light);
  color: var(--blue-dark);
  border: 1px solid rgba(59,130,246,.2);
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  padding: 5px 14px;
  margin-bottom: 16px;
}

/* --- Tool detail extras --- */
.section-card {
  background: var(--bg);
  border: 1.5px solid var(--gray-100);
  border-radius: var(--radius-xl);
  padding: 24px;
  margin-bottom: 16px;
}

.section-card h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 14px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--gray-100);
}

.info-item {
  text-align: center;
  padding: 12px;
  background: var(--bg-subtle);
  border-radius: var(--radius-md);
  border: 1px solid var(--gray-100);
}

.info-label {
  font-size: 10px;
  color: var(--gray-400);
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.info-value { font-size: 14px; font-weight: 700; }

.btn-visit {
  background: linear-gradient(135deg, var(--blue), var(--purple));
  color: #fff;
  padding: 11px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: opacity var(--transition);
}

.btn-visit:hover { opacity: .92; }

.btn-compare {
  background: transparent;
  color: var(--gray-700);
  padding: 11px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  border: 1.5px solid var(--gray-100);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  transition: border-color var(--transition);
}

.btn-compare:hover { border-color: var(--blue); }

.compare-links { display: flex; flex-direction: column; gap: 8px; }

.compare-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: var(--bg-subtle);
  border: 1px solid var(--gray-100);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color var(--transition);
}

.compare-link:hover { border-color: var(--blue); }

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.similar-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px;
  background: var(--bg-subtle);
  border: 1px solid var(--gray-100);
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  transition: border-color var(--transition);
}

.similar-card:hover { border-color: var(--blue); }

.similar-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--blue-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.article-link {
  display: block;
  padding: 14px;
  background: var(--bg-subtle);
  border: 1px solid var(--gray-100);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: border-color var(--transition);
}

.article-link:hover { border-color: var(--blue); }

.article-link .article-type {
  font-size: 10px;
  font-weight: 700;
  color: var(--blue-dark);
  margin-bottom: 4px;
}

.article-link h3 {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
  color: var(--gray-900);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  background: var(--bg);
  border: 1.5px solid var(--gray-100);
  border-radius: var(--radius-lg);
  padding: 20px;
  text-align: center;
}

.stat-card strong {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 4px;
}

.stat-card span {
  font-size: 12px;
  color: var(--gray-400);
  font-weight: 600;
}

.cta-box {
  background: linear-gradient(135deg, #1e3a8a, #6d28d9);
  color: #fff;
  border-radius: var(--radius-xl);
  padding: 40px 28px;
  text-align: center;
  margin-bottom: 16px;
}

.cta-box h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #fff;
}

.cta-box p { color: rgba(255,255,255,.75); margin-bottom: 20px; }

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.compare-hub-note .note {
  background: var(--bg-subtle);
  border: 1px solid var(--gray-100);
  border-right: 3px solid var(--blue);
  padding: 14px 16px;
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--gray-700);
  line-height: 1.7;
}

[dir="ltr"] .compare-hub-note .note {
  border-right: 1px solid var(--gray-100);
  border-left: 3px solid var(--blue);
}

@media (max-width: 768px) {
  .page-hero-bar,
  .inner-hero { padding: 32px 18px 28px; }
  .page-controls { padding: 20px 18px 0; }
  .grid-tools { grid-template-columns: repeat(2, 1fr); }
  .compare-hub-grid,
  .comp-grid-list { grid-template-columns: 1fr; }
  .tool-hero-top { flex-direction: column; }
  .post-footer { flex-direction: column; align-items: flex-start; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .compare-detail .inner-hero.compare-hero { padding: 32px 18px 28px; }
}
`;

const contentPages = blueify(fs.readFileSync(path.join(CSS, 'content-pages.css'), 'utf8'));
const blogListing = fs.readFileSync(path.join(CSS, 'blog-listing.css'), 'utf8')
  .replace(/\/\* Blog listing[\s\S]*?\*\//, '/* Blog listing (merged) */');

const out = innerExtras + '\n\n' + contentPages + '\n\n' + blogListing;
fs.writeFileSync(path.join(CSS, 'pages.css'), out, 'utf8');
console.log('Wrote assets/css/pages.css (' + out.length + ' bytes)');
