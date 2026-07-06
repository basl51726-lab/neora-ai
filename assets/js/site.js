/**
 * Neora AI — Shared site chrome (nav, footer, utilities)
 * Used on all inner pages. Homepage uses homepage.js instead.
 */
(function () {
  'use strict';

  function setFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  function setActiveNav() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      const href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
      if (href === '/' && path === '/') {
        a.setAttribute('aria-current', 'page');
      } else if (href !== '/' && (path === href || path.startsWith(href + '/'))) {
        a.setAttribute('aria-current', 'page');
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  function initMobileNav() {
    const toggle = document.querySelector('.nav-mobile-toggle');
    const menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      const total = document.body.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (total > 0 ? window.scrollY / total : 0) + ')';
    }, { passive: true });
  }

  function init() {
    setFooterYear();
    setActiveNav();
    initMobileNav();
    initReadingProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
