/* ==========================================================================
   Comparely — Common (shared across every page)
   Provides: header/footer rendering, nav behavior, theme toggle, version
   badges, toast, and small product-display utilities (getProduct, price/
   rating formatting) used by more than one page. Pages that render product
   data (index.html, compare.html) must load products.js before this file.
   Load order on every page: products.js (if needed) -> common.js -> page script.
   ========================================================================== */

const APP_VERSION = '0.3.0';

/* ---------- Icon library (inline SVG strings) ---------- */
const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  sun: '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
  moon: '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3a2 2 0 0 1-2 4h-1"/><path d="M7 5H4a2 2 0 0 0 2 4h1"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
  thumbsUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>',
  thumbsDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  fileText: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  barChart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
  starOutline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  messageSquare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
};

const CATEGORY_ICONS = {
  Smartphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2" ry="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>',
  Laptops: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="11" rx="1.5"/><path d="M2 18.5h20l-1.2 2.1a2 2 0 0 1-1.74 1H4.94a2 2 0 0 1-1.74-1L2 18.5z"/></svg>',
  Headphones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="16" y="12" width="5" height="7" rx="2"/><rect x="3" y="12" width="5" height="7" rx="2"/></svg>',
  Smartwatches: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="2.5"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/><path d="M9 17v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3"/></svg>',
  Tablets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>'
};

const CATEGORY_GRADIENTS = {
  Smartphones: 'linear-gradient(135deg,#6653f2,#a78bfa)',
  Laptops: 'linear-gradient(135deg,#0ea5b7,#3b82f6)',
  Headphones: 'linear-gradient(135deg,#f0664a,#ef4444)',
  Smartwatches: 'linear-gradient(135deg,#0da96f,#0ea5b7)',
  Tablets: 'linear-gradient(135deg,#ec4899,#f0664a)'
};

const CATEGORIES = ['All', 'Smartphones', 'Laptops', 'Headphones', 'Smartwatches', 'Tablets'];

function categorySlug(cat) { return String(cat).toLowerCase(); }

/* ---------- Product-display utilities (used by home.js and compare.js) ---------- */
function getProduct(id) {
  if (typeof PRODUCTS === 'undefined') return null;
  return PRODUCTS.find(function (p) { return p.id === id; }) || null;
}

function fmtPrice(n) { return '$' + n.toLocaleString('en-US'); }
function fmtCount(n) { return n.toLocaleString('en-US'); }

function starsHTML(rating) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return '<span class="stars"><span class="stars-bg">\u2605\u2605\u2605\u2605\u2605</span>' +
    '<span class="stars-fg" style="width:' + pct + '%">\u2605\u2605\u2605\u2605\u2605</span></span>' +
    '<span class="rating-num">' + rating.toFixed(1) + '</span>';
}

/* ---------- Generic helpers ---------- */
function raf(fn) {
  if (typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(fn);
  else setTimeout(fn, 16);
}

function safeScrollIntoView(el, opts) {
  if (el && typeof el.scrollIntoView === 'function') {
    try { el.scrollIntoView(opts); } catch (e) { /* not supported in this environment */ }
  }
}

/* ---------- Toast (shared) ---------- */
let toastTimer = null;
function showToast(msg) {
  const toastEl = document.getElementById('toast');
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toastEl.classList.remove('visible'); }, 2600);
}

/* ---------- Version badges ---------- */
function renderVersionBadges() {
  document.querySelectorAll('[data-version]').forEach(function (el) {
    el.textContent = el.dataset.version === 'short'
      ? ('v' + APP_VERSION)
      : ('Comparely Developer Preview v' + APP_VERSION);
  });
}

/* ---------- Shared header & footer markup ---------- */
function headerHTML() {
  return (
    '<div class="container header-inner">' +
      '<a href="index.html" class="logo" aria-label="Comparely home">' +
        '<span class="logo-badge" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/></svg></span>' +
        '<span class="logo-text">Compare<b>ly</b></span>' +
      '</a>' +
      '<nav class="main-nav" aria-label="Main">' +
        '<a href="index.html" class="nav-link" data-nav="home">Home</a>' +
        '<a href="compare.html" class="nav-link" data-nav="compare">Compare</a>' +
        '<a href="assistant.html" class="nav-link" data-nav="assistant">Assistant</a>' +
        '<a href="about.html" class="nav-link" data-nav="about">About</a>' +
      '</nav>' +
      '<div class="header-actions">' +
        '<div class="nav-search" id="navSearch">' +
          '<button class="nav-search-btn" id="navSearchBtn" type="button" aria-label="Search products">' + ICONS.search + '</button>' +
          '<div class="nav-search-panel" id="navSearchPanel">' +
            '<input type="text" id="navSearchInput" placeholder="Search products or brands\u2026" aria-label="Search products" autocomplete="off">' +
          '</div>' +
        '</div>' +
        '<span class="version-pill" data-version="short" title="Comparely Developer Preview"></span>' +
        '<button id="themeToggle" class="theme-toggle" type="button" aria-label="Toggle dark mode">' + ICONS.sun + ICONS.moon + '</button>' +
        '<button class="nav-toggle" id="navToggle" type="button" aria-label="Open menu" aria-expanded="false">' + ICONS.menu + '</button>' +
      '</div>' +
    '</div>' +
    '<div class="mobile-nav" id="mobileNav" hidden>' +
      '<a href="index.html" class="mobile-nav-link" data-nav="home">Home</a>' +
      '<a href="compare.html" class="mobile-nav-link" data-nav="compare">Compare</a>' +
      '<a href="assistant.html" class="mobile-nav-link" data-nav="assistant">Assistant</a>' +
      '<a href="about.html" class="mobile-nav-link" data-nav="about">About</a>' +
    '</div>'
  );
}

function footerHTML() {
  const year = new Date().getFullYear();
  return (
    '<div class="container footer-inner">' +
      '<div class="footer-top">' +
        '<div class="footer-brand">' +
          '<span class="logo-text">Compare<b>ly</b></span>' +
          '<p>A demo product-comparison experience. Search two products and see exactly where each one wins.</p>' +
          '<span class="version-badge" data-version="full"></span>' +
        '</div>' +
        '<div class="footer-links">' +
          '<a href="index.html">Home</a>' +
          '<a href="compare.html">Compare</a>' +
          '<a href="assistant.html">Assistant</a>' +
          '<a href="about.html">About</a>' +
          '<a href="about.html#privacy">Privacy</a>' +
          '<a href="about.html#terms">Terms</a>' +
          '<a href="#" target="_blank" rel="noopener">GitHub</a>' +
        '</div>' +
      '</div>' +
      '<p class="footer-copy">\u00A9 ' + year + ' Comparely. Product data is illustrative sample data, not live pricing.</p>' +
    '</div>'
  );
}

function renderHeader() {
  const el = document.getElementById('siteHeader');
  if (el) el.innerHTML = headerHTML();
}

function renderFooter() {
  const el = document.getElementById('siteFooter');
  if (el) el.innerHTML = footerHTML();
}

/* ---------- Active nav highlighting ---------- */
function highlightActiveNav() {
  const page = document.body.dataset.page;
  if (!page) return;
  document.querySelectorAll('[data-nav]').forEach(function (a) {
    if (a.dataset.nav === page) a.classList.add('active');
  });
}

/* ---------- Theme toggle ---------- */
function applyThemeColor() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const meta = document.getElementById('themeColorMeta');
  if (meta) meta.setAttribute('content', isDark ? '#100e17' : '#faf9fb');
}

function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  applyThemeColor();
  btn.addEventListener('click', function () {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    applyThemeColor();
  });
}

/* ---------- Mobile nav toggle ---------- */
function initMobileNav() {
  const btn = document.getElementById('navToggle');
  const panel = document.getElementById('mobileNav');
  if (!btn || !panel) return;
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    btn.setAttribute('aria-expanded', String(!isOpen));
    closeNavSearch();
  });
  document.addEventListener('click', function (e) {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) {
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------- Nav search (jumps to compare.html?q=...) ---------- */
function closeNavSearch() {
  const wrap = document.getElementById('navSearch');
  if (wrap) wrap.classList.remove('open');
}

function initNavSearch() {
  const btn = document.getElementById('navSearchBtn');
  const wrap = document.getElementById('navSearch');
  const input = document.getElementById('navSearchInput');
  if (!btn || !wrap || !input) return;

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const willOpen = !wrap.classList.contains('open');
    wrap.classList.toggle('open', willOpen);
    const mobilePanel = document.getElementById('mobileNav');
    const mobileBtn = document.getElementById('navToggle');
    if (willOpen && mobilePanel && mobileBtn) {
      mobilePanel.hidden = true;
      mobileBtn.setAttribute('aria-expanded', 'false');
    }
    if (willOpen) input.focus();
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && input.value.trim()) {
      window.location.href = 'compare.html?q=' + encodeURIComponent(input.value.trim());
    }
    if (e.key === 'Escape') closeNavSearch();
  });

  document.addEventListener('click', function (e) {
    if (wrap.classList.contains('open') && !wrap.contains(e.target)) closeNavSearch();
  });
}

/* ---------- Init ---------- */
function initCommon() {
  renderHeader();
  renderFooter();
  renderVersionBadges();
  highlightActiveNav();
  initThemeToggle();
  initMobileNav();
  initNavSearch();
}

initCommon();
