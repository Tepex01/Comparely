/* ==========================================================================
   Comparely — Home page logic
   Depends on: products.js (PRODUCTS) and common.js (CATEGORY_ICONS,
   CATEGORY_GRADIENTS, CATEGORIES, getProduct, fmtPrice, fmtCount, starsHTML).
   Load order: products.js -> common.js -> home.js (see index.html).
   The homepage has no local product grid — every card here links out to
   compare.html with the right product(s)/category/query pre-selected.
   ========================================================================== */

const FEATURED_IDS = [6, 14, 40, 77, 84, 108, 134, 38];
const TRENDING_PAIRS = [[6, 14], [38, 40], [77, 84], [108, 114], [134, 141], [19, 5]];

function featuredCardHTML(p, i) {
  return (
    '<a class="product-card featured-card" href="compare.html?a=' + p.id + '" style="--i:' + i + '">' +
      '<div class="card-media" style="background:' + CATEGORY_GRADIENTS[p.category] + '">' +
        CATEGORY_ICONS[p.category] +
        '<span class="card-category-tag">' + p.category + '</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<span class="card-brand">' + p.brand + '</span>' +
        '<h3 class="card-name">' + p.name + '</h3>' +
        '<div class="card-rating">' + starsHTML(p.rating) + '<span class="rating-count">(' + fmtCount(p.reviews) + ')</span></div>' +
        '<div class="card-footer">' +
          '<span class="card-price">' + fmtPrice(p.price) + '</span>' +
          '<span class="card-cta">Compare \u2192</span>' +
        '</div>' +
      '</div>' +
    '</a>'
  );
}

function categoryTileHTML(cat) {
  const count = (typeof PRODUCTS !== 'undefined') ? PRODUCTS.filter(function (p) { return p.category === cat; }).length : 0;
  return (
    '<a class="category-tile" href="compare.html?category=' + encodeURIComponent(cat) + '">' +
      '<span class="category-tile-icon" style="background:' + CATEGORY_GRADIENTS[cat] + '">' + CATEGORY_ICONS[cat] + '</span>' +
      '<span class="category-tile-name">' + cat + '</span>' +
      '<span class="category-tile-count">' + count + ' products</span>' +
    '</a>'
  );
}

function trendingMiniHTML(p) {
  return (
    '<span class="trending-mini">' +
      '<span class="trending-mini-icon" style="background:' + CATEGORY_GRADIENTS[p.category] + '">' + CATEGORY_ICONS[p.category] + '</span>' +
      '<span class="trending-mini-text"><span class="trending-mini-name">' + p.name + '</span><span class="trending-mini-price">' + fmtPrice(p.price) + '</span></span>' +
    '</span>'
  );
}

function trendingCardHTML(pair) {
  const a = getProduct(pair[0]), b = getProduct(pair[1]);
  if (!a || !b) return '';
  return (
    '<a class="trending-card" href="compare.html?a=' + a.id + '&b=' + b.id + '">' +
      trendingMiniHTML(a) +
      '<span class="trending-vs">VS</span>' +
      trendingMiniHTML(b) +
    '</a>'
  );
}

function renderFeatured() {
  const el = document.getElementById('featuredGrid');
  if (!el) return;
  el.innerHTML = FEATURED_IDS.map(function (id, i) {
    const p = getProduct(id);
    return p ? featuredCardHTML(p, i) : '';
  }).join('');
}

function renderCategories() {
  const el = document.getElementById('categoryTiles');
  if (!el) return;
  el.innerHTML = CATEGORIES.filter(function (c) { return c !== 'All'; }).map(categoryTileHTML).join('');
}

function renderTrending() {
  const el = document.getElementById('trendingGrid');
  if (!el) return;
  el.innerHTML = TRENDING_PAIRS.map(trendingCardHTML).join('');
}

function initHeroSearch() {
  const input = document.getElementById('heroSearchInput');
  const btn = document.getElementById('heroSearchBtn');
  if (!input) return;
  function go() {
    const q = input.value.trim();
    window.location.href = q ? ('compare.html?q=' + encodeURIComponent(q)) : 'compare.html';
  }
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); go(); }
  });
  if (btn) btn.addEventListener('click', go);
}

function init() {
  if (typeof PRODUCTS === 'undefined' || !Array.isArray(PRODUCTS)) {
    console.error('Comparely: PRODUCTS is not defined. Make sure products.js loads before home.js.');
    return;
  }
  renderFeatured();
  renderCategories();
  renderTrending();
  initHeroSearch();
}

init();
