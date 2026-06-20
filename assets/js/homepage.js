/**
 * Neora AI — Homepage JavaScript
 * Version: 2.0
 * File: /assets/js/homepage.js
 *
 * Handles:
 *  - Live search with dropdown
 *  - Dynamic tool cards from tools-index.json
 *  - Dynamic articles from posts-index.json
 *  - Dynamic comparisons from compare-index.json
 *  - Category counts from tools-index.json
 *  - Newsletter form
 *  - Mobile navigation
 *  - Stat counters
 *  - Dashboard date
 */

(function () {
  'use strict';

  /* ─── Config ─── */
  const CONFIG = {
    TOOLS_JSON:       '/tools-index.json',
    POSTS_JSON:       '/posts-index.json',
    COMPARE_JSON:     '/compare-index.json',
    SEARCH_MIN_CHARS: 2,
    SEARCH_MAX_RESULTS: 6,
    TOP_TOOLS_COUNT:  4,
    POPULAR_TOOLS:    ['chatgpt', 'claude', 'gemini', 'cursor', 'perplexity', 'midjourney'],
    FEATURED_COMPS:   ['chatgpt-vs-claude', 'cursor-vs-windsurf', 'claude-vs-gemini', 'lovable-vs-replit'],
    LATEST_COMPS_COUNT: 3,
    LATEST_ARTICLES_COUNT: 3,
    NEWSLETTER_ENDPOINT: 'https://app.netlify.com/api/v1/sites/YOUR_SITE_ID/submissions',
  };

  /* ─── Tool brand colours (fallback icons when no logo available) ─── */
  const TOOL_BRAND = {
    chatgpt:    { bg: '#F0FDF4', color: '#10A37F' },
    claude:     { bg: '#F3EEFF', color: '#7C3AED' },
    gemini:     { bg: '#E9F5EF', color: '#1A7A4A' },
    cursor:     { bg: '#EEF7FF', color: '#0E6BA8' },
    windsurf:   { bg: '#F0FCFF', color: '#0891B2' },
    perplexity: { bg: '#FFF4EC', color: '#F97316' },
    midjourney: { bg: '#FFF0F5', color: '#B0355A' },
    lovable:    { bg: '#F5F0FF', color: '#8B5CF6' },
    notion:     { bg: '#F5F5F5', color: '#333' },
    default:    { bg: '#F5F5F5', color: '#888' },
  };

  /* ─── Cache ─── */
  let _tools = null;
  let _posts  = null;
  let _comps  = null;

  /* ═══════════════════════════════
     DATA FETCHING
  ═══════════════════════════════ */
  async function fetchJSON(url) {
    try {
      const res = await fetch(url, { cache: 'default' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn(`[Neora] Could not load ${url}:`, e.message);
      return null;
    }
  }

  async function getTools() {
    if (_tools) return _tools;
    const data = await fetchJSON(CONFIG.TOOLS_JSON);
    _tools = Array.isArray(data) ? data : (data?.tools || []);
    return _tools;
  }

  async function getPosts() {
    if (_posts) return _posts;
    const data = await fetchJSON(CONFIG.POSTS_JSON);
    _posts = Array.isArray(data) ? data : (data?.posts || []);
    return _posts;
  }

  async function getComps() {
    if (_comps) return _comps;
    const data = await fetchJSON(CONFIG.COMPARE_JSON);
    _comps = Array.isArray(data) ? data : (data?.comparisons || []);
    return _comps;
  }

  /* ═══════════════════════════════
     HELPERS
  ═══════════════════════════════ */
  function slugify(str) {
    return (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function getBrand(slug) {
    const key = slugify(slug);
    return TOOL_BRAND[key] || TOOL_BRAND.default;
  }

  function starsHTML(score) {
    const full  = Math.round((score / 10) * 5);
    const empty = 5 - full;
    return '★'.repeat(full) + '☆'.repeat(empty);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return dateStr; }
  }

  function toolLogoHTML(tool, size = 22) {
    const slug  = slugify(tool.name || tool.slug || '');
    const brand = getBrand(slug);
    const logo  = tool.logo || tool.image || '';

    if (logo) {
      return `<img src="${logo}" alt="${tool.name} logo" width="${size}" height="${size}" loading="lazy" style="border-radius:4px;object-fit:contain;">`;
    }
    const initials = (tool.name || '?').slice(0, 2).toUpperCase();
    return `<span style="font-size:${Math.round(size * 0.5)}px;font-weight:700;color:${brand.color}">${initials}</span>`;
  }

  function clearSkeletons(container) {
    if (!container) return;
    container.querySelectorAll('.skeleton, .skeleton-comp, .tool-pill-skeleton, .ccard-skeleton, .acard-skeleton').forEach(el => el.remove());
  }

  /* ═══════════════════════════════
     DASHBOARD DATE
  ═══════════════════════════════ */
  function setDashDate() {
    const el = document.getElementById('dash-date');
    if (!el) return;
    el.textContent = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  /* ═══════════════════════════════
     TOP TOOLS DASHBOARD
  ═══════════════════════════════ */
  async function renderTopTools() {
    const container = document.getElementById('top-tools-list');
    if (!container) return;

    const tools = await getTools();
    if (!tools.length) { container.innerHTML = '<p class="search-no-results">No tools found.</p>'; return; }

    const sorted = [...tools]
      .filter(t => t.rating || t.score)
      .sort((a, b) => ((b.rating || b.score || 0) - (a.rating || a.score || 0)))
      .slice(0, CONFIG.TOP_TOOLS_COUNT);

    clearSkeletons(container);

    sorted.forEach(tool => {
      const slug   = slugify(tool.slug || tool.name);
      const brand  = getBrand(slug);
      const score  = parseFloat(tool.rating || tool.score || 0).toFixed(1);
      const stars  = starsHTML(parseFloat(score) * 10 / 10 * 10);
      const maker  = tool.maker || tool.company || tool.author || '';
      const logo   = tool.logo || tool.image || '';

      const row = document.createElement('a');
      row.href  = `/tools/${slug}/`;
      row.className = 'tool-row';
      row.setAttribute('role', 'listitem');
      row.setAttribute('aria-label', `${tool.name} — rated ${score} out of 10`);
      row.innerHTML = `
        <div class="tr-left">
          <div class="tr-av" style="background:${brand.bg}">
            ${logo
              ? `<img src="${logo}" alt="${tool.name}" width="22" height="22" loading="lazy" style="object-fit:contain;border-radius:4px;">`
              : `<span style="font-size:11px;font-weight:700;color:${brand.color}">${(tool.name||'?').slice(0,2).toUpperCase()}</span>`
            }
          </div>
          <div>
            <div class="tr-name">${tool.name}</div>
            ${maker ? `<div class="tr-maker">${maker}</div>` : ''}
          </div>
        </div>
        <div class="tr-right">
          <div class="tr-stars" aria-hidden="true">${stars}</div>
          <div class="tr-num">${score}</div>
        </div>
      `;
      container.appendChild(row);
    });

    // Update stat counter
    const statEl = document.getElementById('stat-tools');
    if (statEl && tools.length > 10) {
      statEl.innerHTML = `${tools.length}<em>+</em>`;
    }
    const countEl = document.getElementById('tools-count');
    if (countEl && tools.length > 10) countEl.textContent = `${tools.length}+`;
  }

  /* ═══════════════════════════════
     LATEST COMPARISONS MINI PANEL
  ═══════════════════════════════ */
  async function renderLatestComparisons() {
    const container = document.getElementById('latest-comparisons-list');
    if (!container) return;

    const comps = await getComps();
    clearSkeletons(container);

    const list = comps.length
      ? comps.slice(0, CONFIG.LATEST_COMPS_COUNT)
      : CONFIG.FEATURED_COMPS.slice(0, CONFIG.LATEST_COMPS_COUNT).map(slug => {
          const [a, , b] = slug.split('-vs-');
          return { slug, tool_a: a, tool_b: b };
        });

    list.forEach(comp => {
      const nameA = comp.tool_a_name || comp.tool_a || '';
      const nameB = comp.tool_b_name || comp.tool_b || '';
      const url   = comp.url || `/compare/${comp.slug}/`;

      const row = document.createElement('a');
      row.href      = url;
      row.className = 'cm-row';
      row.setAttribute('aria-label', `Compare ${nameA} vs ${nameB}`);
      row.innerHTML = `
        <div class="cmp">${nameA}</div>
        <span class="cmvs">vs</span>
        <div class="cmp">${nameB}</div>
        <div class="cmgo" aria-hidden="true">
          <svg viewBox="0 0 10 10" fill="none" width="10" height="10">
            <path d="M2 5h6M5.5 2l3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      `;
      container.appendChild(row);
    });

    // Update stat
    const statEl = document.getElementById('stat-comparisons');
    if (statEl && comps.length > 5) statEl.innerHTML = `${comps.length}<em>+</em>`;
  }

  /* ═══════════════════════════════
     POPULAR TOOLS GRID
  ═══════════════════════════════ */
  async function renderPopularTools() {
    const container = document.getElementById('popular-tools-grid');
    if (!container) return;

    const tools = await getTools();
    clearSkeletons(container);

    // Try to get featured tools by slug first, fallback to top-rated
    const featured = CONFIG.POPULAR_TOOLS.map(slug =>
      tools.find(t => slugify(t.slug || t.name) === slug)
    ).filter(Boolean);

    const list = featured.length >= 4
      ? featured.slice(0, 6)
      : [...tools].sort((a,b) => (b.rating||b.score||0) - (a.rating||a.score||0)).slice(0, 6);

    list.forEach(tool => {
      const slug  = slugify(tool.slug || tool.name);
      const brand = getBrand(slug);
      const score = parseFloat(tool.rating || tool.score || 0).toFixed(1);
      const cat   = tool.category || tool.categories?.[0] || '';
      const logo  = tool.logo || tool.image || '';

      const pill = document.createElement('a');
      pill.href      = `/tools/${slug}/`;
      pill.className = 'tool-pill';
      pill.setAttribute('role', 'listitem');
      pill.setAttribute('aria-label', `${tool.name} — ${cat}`);
      pill.innerHTML = `
        <div class="tp-av" style="background:${brand.bg}">
          ${logo
            ? `<img src="${logo}" alt="${tool.name}" width="28" height="28" loading="lazy" style="object-fit:contain;">`
            : `<span style="font-size:12px;font-weight:700;color:${brand.color}">${(tool.name||'?').slice(0,2).toUpperCase()}</span>`
          }
        </div>
        <div class="tp-name">${tool.name}</div>
        <div class="tp-cat">${cat}</div>
        ${score > 0 ? `<span class="tp-score" style="background:${brand.bg};color:${brand.color}">${score} ★</span>` : ''}
      `;
      container.appendChild(pill);
    });
  }

  /* ═══════════════════════════════
     CATEGORY COUNTS
  ═══════════════════════════════ */
  async function updateCategoryCounts() {
    const tools = await getTools();
    if (!tools.length) return;

    document.querySelectorAll('[data-category]').forEach(el => {
      const cat   = el.dataset.category;
      const count = tools.filter(t => {
        const cats = (t.categories || [t.category] || []).map(c => slugify(c));
        return cats.includes(cat);
      }).length;
      if (count > 0) el.textContent = `${count} tool${count !== 1 ? 's' : ''}`;
    });
  }

  /* ═══════════════════════════════
     FEATURED COMPARISONS GRID
  ═══════════════════════════════ */
  async function renderComparisons() {
    const container = document.getElementById('comparisons-grid');
    if (!container) return;

    const comps = await getComps();
    clearSkeletons(container);

    const featured = CONFIG.FEATURED_COMPS.map(slug =>
      comps.find(c => c.slug === slug)
    ).filter(Boolean);

    const list = featured.length >= 2
      ? featured.slice(0, 4)
      : comps.slice(0, 4);

    // Static fallback data
    const FALLBACK = [
      { slug: 'chatgpt-vs-claude',   tool_a: 'ChatGPT', tool_b: 'Claude',       tag: 'Most Read',    desc: 'Which AI is better for your workflow in 2026?' },
      { slug: 'cursor-vs-windsurf',  tool_a: 'Cursor',  tool_b: 'Windsurf',     tag: 'Coding',       desc: 'Cursor code editor vs Windsurf — which delivers more?' },
      { slug: 'claude-vs-gemini',    tool_a: 'Claude',  tool_b: 'Gemini',       tag: 'LLMs',         desc: 'Which model is best for reasoning & accuracy?' },
      { slug: 'lovable-vs-replit',   tool_a: 'Lovable', tool_b: 'Replit Agent', tag: 'App Builders', desc: 'Build apps faster with AI — side by side' },
    ];

    const renderList = list.length >= 2 ? list : FALLBACK;

    renderList.slice(0, 4).forEach(comp => {
      const nameA = comp.tool_a_name || comp.tool_a || '';
      const nameB = comp.tool_b_name || comp.tool_b || '';
      const tag   = comp.category || comp.tag || '';
      const desc  = comp.description || comp.desc || comp.excerpt || '';
      const url   = comp.url || `/compare/${comp.slug}/`;
      const slugA = slugify(nameA);
      const slugB = slugify(nameB);
      const brandA = getBrand(slugA);
      const brandB = getBrand(slugB);
      const logoA  = comp.tool_a_logo || '';
      const logoB  = comp.tool_b_logo || '';

      const card = document.createElement('div');
      card.className = 'ccard';
      card.setAttribute('role', 'listitem');
      card.innerHTML = `
        <div class="cc-tag-row">
          ${tag ? `<span class="cctag">${tag}</span>` : ''}
        </div>
        <div class="cc-tools">
          <div class="cc-tool">
            <div class="cc-tav" style="background:${brandA.bg}">
              ${logoA
                ? `<img src="${logoA}" alt="${nameA}" width="18" height="18" loading="lazy">`
                : `<span style="font-size:9px;font-weight:700;color:${brandA.color}">${nameA.slice(0,2).toUpperCase()}</span>`
              }
            </div>
            <span class="cc-tname">${nameA}</span>
          </div>
          <span class="cc-vs">vs</span>
          <div class="cc-tool">
            <div class="cc-tav" style="background:${brandB.bg}">
              ${logoB
                ? `<img src="${logoB}" alt="${nameB}" width="18" height="18" loading="lazy">`
                : `<span style="font-size:9px;font-weight:700;color:${brandB.color}">${nameB.slice(0,2).toUpperCase()}</span>`
              }
            </div>
            <span class="cc-tname">${nameB}</span>
          </div>
        </div>
        <div class="cc-desc">${desc}</div>
        <div class="cc-arrow">
          <a href="${url}" aria-label="Read comparison: ${nameA} vs ${nameB}">
            Read comparison
            <svg viewBox="0 0 13 13" fill="none" width="13" height="13" aria-hidden="true">
              <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      `;
      container.appendChild(card);
    });
  }

  /* ═══════════════════════════════
     LATEST ARTICLES
  ═══════════════════════════════ */
  async function renderArticles() {
    const container = document.getElementById('articles-grid');
    if (!container) return;

    const posts = await getPosts();
    clearSkeletons(container);

    const list = [...posts]
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, CONFIG.LATEST_ARTICLES_COUNT);

    if (!list.length) {
      container.innerHTML = '<p class="search-no-results">No articles found.</p>';
      return;
    }

    list.forEach(post => {
      const url     = post.url || `/blog/${post.slug}/`;
      const tag     = post.category || post.type || 'Article';
      const title   = post.title || 'Untitled';
      const author  = post.author || '';
      const date    = formatDate(post.date);
      const readTime = post.read_time || post.readTime || '';
      const image   = post.image || post.thumbnail || post.cover || '';
      const initials = author ? author.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : '';

      const card = document.createElement('a');
      card.href      = url;
      card.className = 'acard';
      card.setAttribute('role', 'listitem');
      card.setAttribute('aria-label', `${tag}: ${title}`);
      card.innerHTML = `
        <div class="aimg">
          ${image
            ? `<img src="${image}" alt="${title}" loading="lazy">`
            : `<div class="aimg-placeholder" aria-hidden="true">
                <svg viewBox="0 0 48 48" fill="none" width="40" height="40" opacity="0.3">
                  <rect x="4" y="8" width="40" height="32" rx="4" stroke="#D4A64A" stroke-width="2"/>
                  <path d="M4 28l12-10 10 8 8-6 10 10" stroke="#D4A64A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="16" cy="18" r="3" stroke="#D4A64A" stroke-width="2"/>
                </svg>
               </div>`
          }
        </div>
        <div class="abody">
          <div class="atag">${tag}</div>
          <div class="atitle">${title}</div>
          <div class="ameta">
            ${initials ? `
              <div class="aav">
                <div class="aav-dot" style="background:#EBF4FF;color:#1A6ECF" aria-hidden="true">${initials}</div>
                ${author}
              </div>
              <span aria-hidden="true">·</span>
            ` : ''}
            ${readTime ? `<span>${readTime} min read</span>` : ''}
            ${date ? `<span>${date}</span>` : ''}
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  /* ═══════════════════════════════
     LIVE SEARCH
  ═══════════════════════════════ */
  let searchDebounce = null;

  async function handleSearch(query) {
    const dropdown = document.getElementById('search-dropdown');
    if (!dropdown) return;

    query = query.trim();

    if (query.length < CONFIG.SEARCH_MIN_CHARS) {
      dropdown.hidden = true;
      return;
    }

    const [tools, posts, comps] = await Promise.all([getTools(), getPosts(), getComps()]);
    const q = query.toLowerCase();

    const toolMatches = tools.filter(t =>
      (t.name || '').toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q) ||
      (t.category || '').toLowerCase().includes(q)
    ).slice(0, 3);

    const postMatches = posts.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    ).slice(0, 2);

    const compMatches = comps.filter(c =>
      (c.title || '').toLowerCase().includes(q) ||
      (c.tool_a || '').toLowerCase().includes(q) ||
      (c.tool_b || '').toLowerCase().includes(q)
    ).slice(0, 1);

    const total = toolMatches.length + postMatches.length + compMatches.length;

    if (total === 0) {
      dropdown.hidden = false;
      dropdown.innerHTML = `<div class="search-no-results">No results for "<strong>${query}</strong>"</div>`;
      return;
    }

    let html = '';

    toolMatches.forEach(t => {
      const slug  = slugify(t.slug || t.name);
      const brand = getBrand(slug);
      const logo  = t.logo || t.image || '';
      html += `
        <a class="search-result-item" href="/tools/${slug}/" aria-label="${t.name} — Tool">
          <div class="search-result-icon" style="background:${brand.bg}">
            ${logo
              ? `<img src="${logo}" alt="${t.name}" width="18" height="18" style="object-fit:contain;">`
              : `<span style="font-size:10px;font-weight:700;color:${brand.color}">${(t.name||'?').slice(0,2).toUpperCase()}</span>`
            }
          </div>
          <div>
            <div class="search-result-name">${t.name}</div>
            <div class="search-result-cat">${t.category || ''}</div>
          </div>
          <span class="search-result-type">Tool</span>
        </a>`;
    });

    compMatches.forEach(c => {
      const url = c.url || `/compare/${c.slug}/`;
      html += `
        <a class="search-result-item" href="${url}" aria-label="${c.tool_a} vs ${c.tool_b} — Comparison">
          <div class="search-result-icon" style="background:#FDF6E9">
            <svg viewBox="0 0 15 15" fill="none" width="14" height="14">
              <rect x="1" y="3" width="6" height="9" rx="1" stroke="#D4A64A" stroke-width="1.5"/>
              <rect x="8" y="3" width="6" height="9" rx="1" stroke="#D4A64A" stroke-width="1.5"/>
            </svg>
          </div>
          <div>
            <div class="search-result-name">${c.tool_a} vs ${c.tool_b}</div>
            <div class="search-result-cat">In-depth comparison</div>
          </div>
          <span class="search-result-type">Compare</span>
        </a>`;
    });

    postMatches.forEach(p => {
      const url = p.url || `/blog/${p.slug}/`;
      html += `
        <a class="search-result-item" href="${url}" aria-label="${p.title} — Article">
          <div class="search-result-icon" style="background:#F5F5F3">
            <svg viewBox="0 0 15 15" fill="none" width="14" height="14">
              <rect x="2" y="1" width="11" height="13" rx="1.5" stroke="#888" stroke-width="1.4"/>
              <path d="M4.5 5h6M4.5 7.5h6M4.5 10h4" stroke="#888" stroke-width="1.3" stroke-linecap="round"/>
            </svg>
          </div>
          <div>
            <div class="search-result-name">${p.title}</div>
            <div class="search-result-cat">${p.category || 'Article'}</div>
          </div>
          <span class="search-result-type">Article</span>
        </a>`;
    });

    dropdown.innerHTML = html;
    dropdown.hidden = false;
  }

  function initSearch() {
    const input    = document.getElementById('hero-search');
    const btn      = document.getElementById('hero-search-btn');
    const dropdown = document.getElementById('search-dropdown');
    if (!input || !btn || !dropdown) return;

    input.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => handleSearch(input.value), 220);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) window.location.href = `/tools/?q=${encodeURIComponent(q)}`;
      }
      if (e.key === 'Escape') { dropdown.hidden = true; }
    });

    btn.addEventListener('click', () => {
      const q = input.value.trim();
      if (q) window.location.href = `/tools/?q=${encodeURIComponent(q)}`;
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.hidden = true;
      }
    });

    // Keyboard navigation in dropdown
    dropdown.addEventListener('keydown', e => {
      const items = dropdown.querySelectorAll('.search-result-item');
      const idx   = Array.from(items).indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (items[idx + 1] || items[0])?.focus(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); (items[idx - 1] || items[items.length - 1])?.focus(); }
      if (e.key === 'Escape')    { dropdown.hidden = true; input.focus(); }
    });
  }

  /* ═══════════════════════════════
     NEWSLETTER FORM
  ═══════════════════════════════ */
  function initNewsletter() {
    const form    = document.getElementById('newsletter-form');
    const msg     = document.getElementById('form-message');
    if (!form || !msg) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = form.querySelector('#newsletter-email').value.trim();
      const btn   = form.querySelector('.esub');

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.textContent = 'Please enter a valid email address.';
        msg.className   = 'form-message error';
        return;
      }

      btn.disabled    = true;
      btn.textContent = 'Subscribing...';
      msg.textContent = '';

      try {
        // Try Netlify Forms first (works automatically on Netlify)
        const formData = new FormData();
        formData.append('form-name', 'newsletter');
        formData.append('email', email);

        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString(),
        });

        if (res.ok) {
          msg.textContent = '🎉 You\'re subscribed! Check your inbox soon.';
          msg.className   = 'form-message success';
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      } catch {
        msg.textContent = 'Something went wrong. Please try again.';
        msg.className   = 'form-message error';
      } finally {
        btn.disabled    = false;
        btn.textContent = 'Subscribe Free';
      }
    });
  }

  /* ═══════════════════════════════
     MOBILE NAV
  ═══════════════════════════════ */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-mobile-toggle');
    const menu   = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ═══════════════════════════════
     FOOTER YEAR
  ═══════════════════════════════ */
  function setFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ═══════════════════════════════
     ACTIVE NAV LINK
  ═══════════════════════════════ */
  function setActiveNav() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(a => {
      if (a.getAttribute('href') === '/' && path === '/') {
        a.setAttribute('aria-current', 'page');
      } else if (a.getAttribute('href') !== '/' && path.startsWith(a.getAttribute('href'))) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ═══════════════════════════════
     INIT
  ═══════════════════════════════ */
  function init() {
    setDashDate();
    setFooterYear();
    setActiveNav();
    initSearch();
    initMobileNav();
    initNewsletter();

    // Load dynamic content in priority order
    renderTopTools();
    renderLatestComparisons();

    // Non-critical — load after a tick
    requestIdleCallback
      ? requestIdleCallback(() => {
          renderPopularTools();
          renderComparisons();
          renderArticles();
          updateCategoryCounts();
        })
      : setTimeout(() => {
          renderPopularTools();
          renderComparisons();
          renderArticles();
          updateCategoryCounts();
        }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
