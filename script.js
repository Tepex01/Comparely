/* ==========================================================================
   Comparely — Application Logic
   ========================================================================== */

/* ---------- Icon library (inline SVG strings) ---------- */
const ICONS = {
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3a2 2 0 0 1-2 4h-1"/><path d="M7 5H4a2 2 0 0 0 2 4h1"/></svg>'
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

/* ---------- Product database (20 items) ---------- */
const PRODUCTS = [
  {
    id: 1, name: 'iPhone 15 Pro', brand: 'Apple', category: 'Smartphones',
    price: 999, rating: 4.7, reviews: 15243,
    features: ['Titanium design', 'A17 Pro chip', 'Action Button', 'USB-C with USB 3 speeds', 'Dynamic Island'],
    pros: ['Best-in-class performance', 'Excellent camera system', 'Premium build quality'],
    cons: ['Expensive', 'No charger included'],
    specs: { Display: '6.1" OLED', Processor: 'A17 Pro', RAM: '8GB', Storage: '128GB', Battery: '3274 mAh', 'Rear Camera': '48MP Triple', Weight: '187g', '5G': 'Yes' }
  },
  {
    id: 2, name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'Smartphones',
    price: 1199, rating: 4.6, reviews: 12876,
    features: ['Built-in S Pen', '200MP camera', 'Titanium frame', 'AI-powered photo editing', '120Hz adaptive display'],
    pros: ['Gorgeous display', 'Versatile camera system', 'Long software support'],
    cons: ['Premium price', 'Large size may not suit everyone', 'Some bloatware in the software'],
    specs: { Display: '6.8" AMOLED', Processor: 'Snapdragon 8 Gen 3', RAM: '12GB', Storage: '256GB', Battery: '5000 mAh', 'Rear Camera': '200MP Quad', Weight: '232g', '5G': 'Yes' }
  },
  {
    id: 3, name: 'Google Pixel 8 Pro', brand: 'Google', category: 'Smartphones',
    price: 999, rating: 4.5, reviews: 8341,
    features: ['Magic Editor AI tools', '7 years of OS updates', 'Temperature sensor', 'Clean Android experience'],
    pros: ['Best computational photography', 'Clean software experience', 'Long update commitment'],
    cons: ['Battery life is average', 'Tensor chip runs warm'],
    specs: { Display: '6.7" OLED', Processor: 'Tensor G3', RAM: '12GB', Storage: '128GB', Battery: '5050 mAh', 'Rear Camera': '50MP Triple', Weight: '213g', '5G': 'Yes' }
  },
  {
    id: 4, name: 'OnePlus 12', brand: 'OnePlus', category: 'Smartphones',
    price: 799, rating: 4.4, reviews: 6120,
    features: ['100W fast charging', 'Hasselblad camera tuning', 'Alert Slider', '120Hz LTPO display'],
    pros: ['Blazing fast charging', 'Flagship specs for less', 'Smooth 120Hz display', 'Generous RAM and storage'],
    cons: ['Software has occasional bugs', 'Wireless charging not available in all markets'],
    specs: { Display: '6.82" AMOLED', Processor: 'Snapdragon 8 Gen 3', RAM: '16GB', Storage: '256GB', Battery: '5400 mAh', 'Rear Camera': '50MP Triple', Weight: '220g', '5G': 'Yes' }
  },
  {
    id: 5, name: 'MacBook Pro 14" M3', brand: 'Apple', category: 'Laptops',
    price: 1599, rating: 4.8, reviews: 9820,
    features: ['M3 chip', 'Liquid Retina XDR display', 'Up to 22-hour battery', 'MagSafe charging', 'Six-speaker sound system'],
    pros: ['Exceptional performance per watt', 'Stunning display', 'Superb build quality', 'Excellent battery life'],
    cons: ['Expensive RAM and storage upgrades', 'Limited port selection'],
    specs: { Display: '14.2" Liquid Retina XDR', Processor: 'Apple M3', RAM: '8GB', Storage: '512GB', 'Battery Life': '22 hours', GPU: '10-core Apple GPU', Weight: '1550g' }
  },
  {
    id: 6, name: 'Dell XPS 15', brand: 'Dell', category: 'Laptops',
    price: 1499, rating: 4.5, reviews: 5433,
    features: ['InfinityEdge display', 'NVIDIA RTX graphics', 'Premium CNC aluminum chassis', 'Optional 4K OLED panel'],
    pros: ['Gorgeous OLED display option', 'Strong creative performance', 'Sleek premium design'],
    cons: ['Battery life trails Apple silicon', 'Can run warm under load', 'Webcam quality is mediocre'],
    specs: { Display: '15.6" FHD+', Processor: 'Intel i7-13700H', RAM: '16GB', Storage: '512GB', 'Battery Life': '13 hours', GPU: 'RTX 4050', Weight: '1860g' }
  },
  {
    id: 7, name: 'ASUS ROG Zephyrus G14', brand: 'ASUS', category: 'Laptops',
    price: 1649, rating: 4.6, reviews: 3872,
    features: ['AniMe Matrix lid display', 'Ryzen 9 processor', '165Hz display', 'Compact gaming chassis'],
    pros: ['Powerful gaming performance in a small body', 'Great display options', 'Strong build quality'],
    cons: ['Fans get loud under load', 'Battery drains fast while gaming'],
    specs: { Display: '14" QHD+ 165Hz', Processor: 'Ryzen 9 8945HS', RAM: '16GB', Storage: '1TB', 'Battery Life': '10 hours', GPU: 'RTX 4060', Weight: '1720g' }
  },
  {
    id: 8, name: 'Lenovo ThinkPad X1 Carbon', brand: 'Lenovo', category: 'Laptops',
    price: 1399, rating: 4.5, reviews: 4210,
    features: ['Military-grade durability', 'Legendary keyboard', 'Rapid Charge', 'Webcam privacy shutter'],
    pros: ['Best-in-class keyboard', 'Ultra-light and durable', 'Excellent for business use'],
    cons: ['Integrated graphics limit gaming', 'Display could be brighter'],
    specs: { Display: '14" WUXGA', Processor: 'Intel i7-1355U', RAM: '16GB', Storage: '512GB', 'Battery Life': '15 hours', GPU: 'Intel Iris Xe', Weight: '1120g' }
  },
  {
    id: 9, name: 'Sony WH-1000XM5', brand: 'Sony', category: 'Headphones',
    price: 399, rating: 4.8, reviews: 22190,
    features: ['Industry-leading ANC', '30-hour battery', 'Multipoint Bluetooth', 'Speak-to-Chat', 'Adaptive Sound Control'],
    pros: ['Best-in-class noise cancelling', 'Excellent sound quality', 'Very comfortable for long wear', 'Reliable multipoint pairing'],
    cons: ['Non-folding hinge design', 'Touch controls can misfire'],
    specs: { Type: 'Over-ear', 'Battery Life': '30 hours', 'Noise Cancelling': 'Yes', Bluetooth: '5.2', 'Driver Size': '30mm', Weight: '250g' }
  },
  {
    id: 10, name: 'Bose QuietComfort Ultra', brand: 'Bose', category: 'Headphones',
    price: 429, rating: 4.7, reviews: 14032,
    features: ['Immersive Audio spatial sound', 'CustomTune calibration', 'Adjustable ANC', 'Plush ear cushions'],
    pros: ['Supremely comfortable fit', 'Excellent noise cancelling', 'Rich, immersive sound'],
    cons: ['Pricier than rivals', 'Shorter battery life than competitors'],
    specs: { Type: 'Over-ear', 'Battery Life': '24 hours', 'Noise Cancelling': 'Yes', Bluetooth: '5.3', 'Driver Size': '35mm', Weight: '254g' }
  },
  {
    id: 11, name: 'Apple AirPods Max', brand: 'Apple', category: 'Headphones',
    price: 549, rating: 4.5, reviews: 9982,
    features: ['Spatial audio with head tracking', 'Digital Crown control', 'Seamless Apple ecosystem pairing', 'Adaptive EQ'],
    pros: ['Seamless integration with Apple devices', 'Premium materials', 'Excellent spatial audio'],
    cons: ['Very expensive', 'Heavier than most rivals', 'No case included by default'],
    specs: { Type: 'Over-ear', 'Battery Life': '20 hours', 'Noise Cancelling': 'Yes', Bluetooth: '5.0', 'Driver Size': '40mm', Weight: '385g' }
  },
  {
    id: 12, name: 'Sennheiser Momentum 4', brand: 'Sennheiser', category: 'Headphones',
    price: 379, rating: 4.6, reviews: 5241,
    features: ['60-hour battery life', 'Adaptive ANC', 'Sound personalization', 'Multipoint connectivity'],
    pros: ['Class-leading battery life', 'Balanced, audiophile-grade sound', 'Comfortable clamping force'],
    cons: ['Bulky folded size', 'Companion app can be finicky'],
    specs: { Type: 'Over-ear', 'Battery Life': '60 hours', 'Noise Cancelling': 'Yes', Bluetooth: '5.2', 'Driver Size': '42mm', Weight: '293g' }
  },
  {
    id: 13, name: 'Apple Watch Series 9', brand: 'Apple', category: 'Smartwatches',
    price: 399, rating: 4.7, reviews: 18320,
    features: ['Double Tap gesture', 'S9 chip with on-device Siri', 'Always-On Retina display', 'Deep ecosystem integration', 'Crash detection'],
    pros: ['Best smartwatch for iPhone users', 'Fast, responsive performance', 'Extensive health tracking', 'Handy Double Tap control'],
    cons: ['Battery barely lasts a full day', 'Requires an iPhone'],
    specs: { Display: '1.9" Always-On Retina', 'Battery Life': '18 hours', 'Water Resistance': '50m', GPS: 'Yes', 'Always-On Display': 'Yes', Weight: '39g' }
  },
  {
    id: 14, name: 'Samsung Galaxy Watch 6', brand: 'Samsung', category: 'Smartwatches',
    price: 299, rating: 4.5, reviews: 7621,
    features: ['Rotating bezel navigation', 'Body composition analysis', 'Sleep coaching', 'Wear OS with Google apps'],
    pros: ['Great display quality', 'Useful health metrics', 'Works well with Android'],
    cons: ['Battery life is modest', 'Best features need a Samsung phone'],
    specs: { Display: '1.5" Super AMOLED', 'Battery Life': '30 hours', 'Water Resistance': '50m', GPS: 'Yes', 'Always-On Display': 'Yes', Weight: '33g' }
  },
  {
    id: 15, name: 'Garmin Venu 3', brand: 'Garmin', category: 'Smartwatches',
    price: 449, rating: 4.6, reviews: 4103,
    features: ['Built-in workout coaching', 'Wheelchair mode', 'Up to 14-day battery', 'Sleep coaching with naps'],
    pros: ['Exceptional battery life', 'Excellent for serious athletes', 'Detailed fitness metrics', 'Great outdoor GPS tracking'],
    cons: ['Limited app ecosystem', 'Interface less polished than Apple or Samsung'],
    specs: { Display: '1.4" AMOLED', 'Battery Life': '336 hours', 'Water Resistance': '50m', GPS: 'Yes', 'Always-On Display': 'Yes', Weight: '47g' }
  },
  {
    id: 16, name: 'Google Pixel Watch 2', brand: 'Google', category: 'Smartwatches',
    price: 349, rating: 4.3, reviews: 3542,
    features: ['Fitbit health tracking built-in', 'Safety check feature', 'Wear OS with Assistant', 'Continuous heart rate tracking'],
    pros: ['Clean, cohesive software', 'Solid safety features', 'Comfortable, compact design'],
    cons: ['Battery struggles with always-on display enabled', 'Limited band compatibility with gen 1'],
    specs: { Display: '1.2" AMOLED', 'Battery Life': '24 hours', 'Water Resistance': '50m', GPS: 'Yes', 'Always-On Display': 'Yes', Weight: '36g' }
  },
  {
    id: 17, name: 'iPad Pro 12.9" M2', brand: 'Apple', category: 'Tablets',
    price: 1099, rating: 4.8, reviews: 11200,
    features: ['M2 chip', 'Liquid Retina XDR mini-LED display', 'Apple Pencil hover support', 'Thunderbolt port', 'Face ID'],
    pros: ['Best-in-class tablet performance', 'Gorgeous mini-LED display', 'Huge app and accessory ecosystem', 'Long software support'],
    cons: ['Very expensive with accessories', 'iPadOS still limits multitasking'],
    specs: { Display: '12.9" Liquid Retina XDR', Processor: 'Apple M2', RAM: '8GB', Storage: '256GB', 'Battery Life': '10 hours', Weight: '682g' }
  },
  {
    id: 18, name: 'Samsung Galaxy Tab S9 Ultra', brand: 'Samsung', category: 'Tablets',
    price: 1199, rating: 4.6, reviews: 4321,
    features: ['S Pen included', 'DeX desktop mode', 'Massive 14.6" AMOLED display', 'IP68 water resistance'],
    pros: ['Huge, vivid AMOLED display', 'Great for productivity with DeX', 'S Pen included in the box'],
    cons: ['Very large for one-handed use', 'Premium pricing'],
    specs: { Display: '14.6" AMOLED', Processor: 'Snapdragon 8 Gen 2', RAM: '12GB', Storage: '256GB', 'Battery Life': '13 hours', Weight: '732g' }
  },
  {
    id: 19, name: 'Microsoft Surface Pro 9', brand: 'Microsoft', category: 'Tablets',
    price: 999, rating: 4.4, reviews: 3890,
    features: ['Full Windows 11 experience', 'Detachable keyboard support', 'Kickstand design', 'Thunderbolt 4'],
    pros: ['Runs full desktop apps', 'Excellent for productivity', 'Versatile laptop replacement'],
    cons: ['Keyboard and pen sold separately', 'Middling battery life for the category'],
    specs: { Display: '13" PixelSense', Processor: 'Intel i5-1235U', RAM: '8GB', Storage: '256GB', 'Battery Life': '15.5 hours', Weight: '879g' }
  },
  {
    id: 20, name: 'Lenovo Tab P12 Pro', brand: 'Lenovo', category: 'Tablets',
    price: 649, rating: 4.2, reviews: 1980,
    features: ['3K OLED display', 'Precision Pen 3 support', 'Quad JBL speakers'],
    pros: ['Vibrant OLED screen', 'Strong multimedia experience'],
    cons: ['App optimization weaker than iPad', 'Software updates less frequent'],
    specs: { Display: '12.7" OLED', Processor: 'MediaTek Kompanio 1300T', RAM: '8GB', Storage: '256GB', 'Battery Life': '11 hours', Weight: '565g' }
  }
];

/* ---------- State ---------- */
const state = {
  search: '',
  category: 'All',
  sort: 'featured',
  selected: [1, 2]
};

/* ---------- DOM refs ---------- */
const els = {
  themeToggle: document.getElementById('themeToggle'),
  themeColorMeta: document.getElementById('themeColorMeta'),
  compareTray: document.getElementById('compareTray'),
  traySlotA: document.getElementById('traySlotA'),
  traySlotB: document.getElementById('traySlotB'),
  swapBtn: document.getElementById('swapBtn'),
  viewComparisonBtn: document.getElementById('viewComparisonBtn'),
  searchInput: document.getElementById('searchInput'),
  categoryPills: document.getElementById('categoryPills'),
  sortSelect: document.getElementById('sortSelect'),
  productGrid: document.getElementById('productGrid'),
  resultsCount: document.getElementById('resultsCount'),
  noResults: document.getElementById('noResults'),
  comparisonSection: document.getElementById('comparisonSection'),
  comparisonPanels: document.getElementById('comparisonPanels'),
  overallLine: document.getElementById('overallLine'),
  scoreStrip: document.getElementById('scoreStrip'),
  comparisonBlocks: document.getElementById('comparisonBlocks'),
  toast: document.getElementById('toast')
};

/* ---------- Helpers ---------- */
function getProduct(id) {
  return PRODUCTS.find(function (p) { return p.id === id; }) || null;
}

function fmtPrice(n) { return '$' + n.toLocaleString('en-US'); }
function fmtCount(n) { return n.toLocaleString('en-US'); }

function raf(fn) {
  if (typeof window.requestAnimationFrame === 'function') window.requestAnimationFrame(fn);
  else setTimeout(fn, 16);
}

function safeScrollIntoView(el, opts) {
  if (el && typeof el.scrollIntoView === 'function') {
    try { el.scrollIntoView(opts); } catch (e) { /* not supported in this environment */ }
  }
}

function starsHTML(rating) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return '<span class="stars"><span class="stars-bg">\u2605\u2605\u2605\u2605\u2605</span>' +
    '<span class="stars-fg" style="width:' + pct + '%">\u2605\u2605\u2605\u2605\u2605</span></span>' +
    '<span class="rating-num">' + rating.toFixed(1) + '</span>';
}

let toastTimer = null;
function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { els.toast.classList.remove('visible'); }, 2600);
}

/* ---------- Spec comparison logic ---------- */
const LOWER_BETTER = ['weight'];
const HIGHER_BETTER = ['battery', 'ram', 'storage', 'camera', 'bluetooth'];
const BOOLEAN_KEYS = ['5g', 'gps', 'noise cancelling', 'always-on display'];

function parseNum(v) {
  const s = String(v);
  const tb = s.match(/([\d.]+)\s*TB/i);
  if (tb) return parseFloat(tb[1]) * 1024;
  const m = s.match(/[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}

function compareSpecValue(key, a, b) {
  const k = key.toLowerCase();
  if (BOOLEAN_KEYS.some(function (w) { return k.indexOf(w) !== -1; })) {
    const ay = /yes/i.test(a), by = /yes/i.test(b);
    if (ay === by) return 0;
    return ay ? -1 : 1;
  }
  let dir = null;
  if (LOWER_BETTER.some(function (w) { return k.indexOf(w) !== -1; })) dir = 'lower';
  else if (HIGHER_BETTER.some(function (w) { return k.indexOf(w) !== -1; })) dir = 'higher';
  if (!dir) return 0;
  const na = parseNum(a), nb = parseNum(b);
  if (na === null || nb === null || na === nb) return 0;
  if (dir === 'higher') return na > nb ? -1 : 1;
  return na < nb ? -1 : 1;
}

function computeWinners(a, b) {
  const results = {};

  results.price = a.price === b.price ? 'tie' : (a.price < b.price ? 'A' : 'B');

  if (a.rating === b.rating) {
    results.rating = a.reviews === b.reviews ? 'tie' : (a.reviews > b.reviews ? 'A' : 'B');
  } else {
    results.rating = a.rating > b.rating ? 'A' : 'B';
  }

  results.features = a.features.length === b.features.length ? 'tie' : (a.features.length > b.features.length ? 'A' : 'B');

  const aNet = a.pros.length - a.cons.length;
  const bNet = b.pros.length - b.cons.length;
  results.prosCons = aNet === bNet ? 'tie' : (aNet > bNet ? 'A' : 'B');

  const specKeys = [];
  Object.keys(a.specs).forEach(function (k) { if (specKeys.indexOf(k) === -1) specKeys.push(k); });
  Object.keys(b.specs).forEach(function (k) { if (specKeys.indexOf(k) === -1) specKeys.push(k); });

  let aSpecWins = 0, bSpecWins = 0;
  const specRows = specKeys.map(function (key) {
    const av = a.specs[key], bv = b.specs[key];
    let winner = null;
    if (av !== undefined && bv !== undefined) {
      const cmp = compareSpecValue(key, av, bv);
      if (cmp === -1) { winner = 'A'; aSpecWins++; }
      else if (cmp === 1) { winner = 'B'; bSpecWins++; }
    }
    return { key: key, av: av, bv: bv, winner: winner };
  });
  results.specifications = aSpecWins === bSpecWins ? 'tie' : (aSpecWins > bSpecWins ? 'A' : 'B');
  results.specRows = specRows;

  return results;
}

function computeOverall(winners) {
  const cats = ['price', 'rating', 'features', 'specifications', 'prosCons'];
  let aWins = 0, bWins = 0;
  cats.forEach(function (c) {
    if (winners[c] === 'A') aWins++;
    else if (winners[c] === 'B') bWins++;
  });
  if (aWins === bWins) return { winner: 'tie', aWins: aWins, bWins: bWins };
  return { winner: aWins > bWins ? 'A' : 'B', aWins: aWins, bWins: bWins };
}

/* ---------- Rendering: product grid ---------- */
function getFilteredSortedProducts() {
  const q = state.search.trim().toLowerCase();
  let list = PRODUCTS.filter(function (p) {
    const matchesCategory = state.category === 'All' || p.category === state.category;
    const matchesSearch = !q ||
      p.name.toLowerCase().indexOf(q) !== -1 ||
      p.brand.toLowerCase().indexOf(q) !== -1 ||
      p.category.toLowerCase().indexOf(q) !== -1;
    return matchesCategory && matchesSearch;
  });

  switch (state.sort) {
    case 'price-asc': list.sort(function (a, b) { return a.price - b.price; }); break;
    case 'price-desc': list.sort(function (a, b) { return b.price - a.price; }); break;
    case 'rating-desc': list.sort(function (a, b) { return b.rating - a.rating; }); break;
    case 'name-asc': list.sort(function (a, b) { return a.name.localeCompare(b.name); }); break;
    default: break;
  }
  return list;
}

function productCardHTML(p, i) {
  const slotIdx = state.selected.indexOf(p.id);
  const slotClass = slotIdx === 0 ? 'slot-a' : slotIdx === 1 ? 'slot-b' : '';
  const isSelected = slotIdx !== -1;
  return (
    '<article class="product-card ' + slotClass + (isSelected ? ' selected' : '') + '" data-id="' + p.id + '" style="--i:' + Math.min(i, 10) + '" tabindex="0" role="button" aria-pressed="' + isSelected + '">' +
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
          '<button class="btn-compare' + (isSelected ? ' is-added' : '') + '" type="button">' +
            (isSelected ? ICONS.check + '<span>Added</span>' : ICONS.plus + '<span>Compare</span>') +
          '</button>' +
        '</div>' +
      '</div>' +
    '</article>'
  );
}

function renderProductGrid() {
  const list = getFilteredSortedProducts();
  els.resultsCount.textContent = list.length + (list.length === 1 ? ' product' : ' products');
  els.noResults.hidden = list.length !== 0;
  els.productGrid.innerHTML = list.map(function (p, i) { return productCardHTML(p, i); }).join('');
}

/* ---------- Rendering: category pills ---------- */
function renderCategoryPills() {
  els.categoryPills.innerHTML = CATEGORIES.map(function (c) {
    return '<button type="button" class="pill' + (state.category === c ? ' active' : '') + '" data-category="' + c + '">' + c + '</button>';
  }).join('');
}

/* ---------- Rendering: compare tray ---------- */
function renderTraySlot(container, id, idx) {
  if (!id) {
    container.className = 'tray-slot empty';
    container.innerHTML = ICONS.plus + '<span>' + (idx === 0 ? 'Choose first product' : 'Choose second product') + '</span>';
    return;
  }
  const p = getProduct(id);
  container.className = 'tray-slot filled ' + (idx === 0 ? 'slot-a' : 'slot-b');
  container.innerHTML =
    '<span class="tray-thumb" style="background:' + CATEGORY_GRADIENTS[p.category] + '">' + CATEGORY_ICONS[p.category] + '</span>' +
    '<span class="tray-info"><span class="tray-name">' + p.name + '</span><span class="tray-price">' + fmtPrice(p.price) + '</span></span>' +
    '<button class="tray-remove" type="button" data-id="' + p.id + '" aria-label="Remove ' + p.name + '">' + ICONS.x + '</button>';
}

function renderTray() {
  renderTraySlot(els.traySlotA, state.selected[0], 0);
  renderTraySlot(els.traySlotB, state.selected[1], 1);
  const bothFilled = !!(state.selected[0] && state.selected[1]);
  els.swapBtn.disabled = !(state.selected[0] || state.selected[1]);
  els.viewComparisonBtn.disabled = !bothFilled;
}

/* ---------- Rendering: comparison ---------- */
function winnerChipHTML(w, a, b) {
  if (w === 'tie') return '<span class="winner-chip">Tie</span>';
  const name = w === 'A' ? a.name : b.name;
  return '<span class="winner-chip ' + (w === 'A' ? 'slot-a' : 'slot-b') + '">' + ICONS.trophy + name + '</span>';
}

function panelHTML(p, slot, isWinner) {
  return (
    '<div class="comparison-panel slot-' + slot + (isWinner ? ' winner' : '') + '">' +
      '<div class="panel-media" style="background:' + CATEGORY_GRADIENTS[p.category] + '">' +
        CATEGORY_ICONS[p.category] +
        (isWinner ? '<span class="winner-crown" title="Overall winner">' + ICONS.trophy + '</span>' : '') +
      '</div>' +
      '<span class="panel-brand">' + p.brand + '</span>' +
      '<h3 class="panel-name">' + p.name + '</h3>' +
      '<div class="panel-rating">' + starsHTML(p.rating) + '</div>' +
      '<span class="rating-count">' + fmtCount(p.reviews) + ' reviews</span>' +
      '<div class="panel-price">' + fmtPrice(p.price) + '</div>' +
      '<button class="panel-remove" type="button" data-id="' + p.id + '">Remove</button>' +
    '</div>'
  );
}

function priceBlockHTML(a, b, winners) {
  const w = winners.price;
  const delta = Math.abs(a.price - b.price);
  const note = w === 'tie' ? 'Both are priced the same.' : ((w === 'A' ? a.name : b.name) + ' is ' + fmtPrice(delta) + ' cheaper.');
  return (
    '<div class="compare-block">' +
      '<div class="block-header"><h3>Price</h3>' + winnerChipHTML(w, a, b) + '</div>' +
      '<div class="price-compare">' +
        '<div class="price-col slot-a' + (w === 'A' ? ' winner' : '') + '"><span class="price-value">' + fmtPrice(a.price) + '</span><span class="price-name">' + a.name + '</span></div>' +
        '<div class="price-vs">vs</div>' +
        '<div class="price-col slot-b' + (w === 'B' ? ' winner' : '') + '"><span class="price-value">' + fmtPrice(b.price) + '</span><span class="price-name">' + b.name + '</span></div>' +
      '</div>' +
      '<p class="block-note">' + note + '</p>' +
    '</div>'
  );
}

function ratingBlockHTML(a, b, winners) {
  const w = winners.rating;
  const col = function (p, slot) {
    return '<div class="rating-col ' + slot + (w === (slot === 'slot-a' ? 'A' : 'B') ? ' winner' : '') + '">' +
      starsHTML(p.rating) + '<span class="rating-count">' + fmtCount(p.reviews) + ' reviews</span>' +
      '<span class="price-name">' + p.name + '</span></div>';
  };
  return (
    '<div class="compare-block">' +
      '<div class="block-header"><h3>Ratings</h3>' + winnerChipHTML(w, a, b) + '</div>' +
      '<div class="rating-compare">' + col(a, 'slot-a') + col(b, 'slot-b') + '</div>' +
    '</div>'
  );
}

function featuresBlockHTML(a, b, winners) {
  const w = winners.features;
  const col = function (p, slot) {
    return '<div class="features-col ' + slot + '"><h4>' + p.name + ' <span class="count-badge">' + p.features.length + '</span></h4>' +
      '<ul>' + p.features.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul></div>';
  };
  return (
    '<div class="compare-block">' +
      '<div class="block-header"><h3>Features</h3>' + winnerChipHTML(w, a, b) + '</div>' +
      '<div class="features-compare">' + col(a, 'slot-a') + col(b, 'slot-b') + '</div>' +
    '</div>'
  );
}

function specsBlockHTML(a, b, winners) {
  const w = winners.specifications;
  const rows = winners.specRows.map(function (r) {
    return (
      '<div class="spec-row">' +
        '<div class="spec-label">' + r.key + '</div>' +
        '<div class="spec-value' + (r.winner === 'A' ? ' winner' : '') + '">' + (r.av !== undefined ? r.av : '\u2014') + (r.winner === 'A' ? ICONS.check : '') + '</div>' +
        '<div class="spec-value' + (r.winner === 'B' ? ' winner' : '') + '">' + (r.bv !== undefined ? r.bv : '\u2014') + (r.winner === 'B' ? ICONS.check : '') + '</div>' +
      '</div>'
    );
  }).join('');
  return (
    '<div class="compare-block">' +
      '<div class="block-header"><h3>Specifications</h3>' + winnerChipHTML(w, a, b) + '</div>' +
      '<div class="spec-table">' +
        '<div class="spec-row spec-header-row"><div class="spec-label"></div>' +
          '<div class="spec-value slot-a-name">' + a.name + '</div>' +
          '<div class="spec-value slot-b-name">' + b.name + '</div>' +
        '</div>' +
        rows +
      '</div>' +
    '</div>'
  );
}

function prosConsBlockHTML(a, b, winners) {
  const w = winners.prosCons;
  const col = function (p, slot) {
    return '<div class="proscons-col ' + slot + '"><h4>' + p.name + '</h4>' +
      '<ul class="pros-list">' + p.pros.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' +
      '<ul class="cons-list">' + p.cons.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
  };
  return (
    '<div class="compare-block">' +
      '<div class="block-header"><h3>Pros &amp; Cons</h3>' + winnerChipHTML(w, a, b) + '</div>' +
      '<div class="proscons-compare">' + col(a, 'slot-a') + col(b, 'slot-b') + '</div>' +
    '</div>'
  );
}

function renderComparison() {
  const idA = state.selected[0], idB = state.selected[1];
  if (!idA || !idB) {
    els.comparisonSection.hidden = true;
    els.comparisonSection.classList.remove('visible');
    return;
  }
  const a = getProduct(idA), b = getProduct(idB);
  if (!a || !b) { els.comparisonSection.hidden = true; return; }

  const winners = computeWinners(a, b);
  const overall = computeOverall(winners);

  els.comparisonPanels.innerHTML = panelHTML(a, 'a', overall.winner === 'A') + panelHTML(b, 'b', overall.winner === 'B');

  els.overallLine.textContent = overall.winner === 'tie'
    ? ("It's close \u2014 " + a.name + ' and ' + b.name + ' each have real strengths.')
    : ((overall.winner === 'A' ? a.name : b.name) + ' wins ' + Math.max(overall.aWins, overall.bWins) + ' of 5 categories.');

  const scoreDefs = [
    { key: 'price', label: 'Price' },
    { key: 'rating', label: 'Ratings' },
    { key: 'features', label: 'Features' },
    { key: 'specifications', label: 'Specifications' },
    { key: 'prosCons', label: 'Pros & Cons' }
  ];
  els.scoreStrip.innerHTML = scoreDefs.map(function (s) {
    const w = winners[s.key];
    const cls = w === 'tie' ? '' : (w === 'A' ? 'slot-a' : 'slot-b');
    const winnerName = w === 'tie' ? 'Tie' : (w === 'A' ? a.name : b.name);
    return '<div class="score-item ' + cls + '"><span class="score-label">' + s.label + '</span><span class="score-winner">' + winnerName + '</span></div>';
  }).join('');

  els.comparisonBlocks.innerHTML =
    priceBlockHTML(a, b, winners) +
    ratingBlockHTML(a, b, winners) +
    featuresBlockHTML(a, b, winners) +
    specsBlockHTML(a, b, winners) +
    prosConsBlockHTML(a, b, winners);

  els.comparisonSection.hidden = false;
  raf(function () { els.comparisonSection.classList.add('visible'); });
}

/* ---------- Master render ---------- */
function renderAll() {
  renderProductGrid();
  renderTray();
  renderComparison();
}

/* ---------- Selection logic ---------- */
function selectProduct(id) {
  const product = getProduct(id);
  if (!product) return;
  const idx = state.selected.indexOf(id);

  if (idx !== -1) {
    state.selected[idx] = null;
    showToast('Removed ' + product.name);
    renderAll();
    return;
  }

  if (!state.selected[0]) {
    state.selected[0] = id;
    showToast('Added ' + product.name + ' \u2014 pick one more to compare');
    renderAll();
    return;
  }

  if (!state.selected[1]) {
    state.selected[1] = id;
    showToast('Comparing ' + getProduct(state.selected[0]).name + ' vs ' + product.name);
    renderAll();
    setTimeout(function () { safeScrollIntoView(els.comparisonSection, { behavior: 'smooth', block: 'start' }); }, 150);
    return;
  }

  const bumped = getProduct(state.selected[0]).name;
  state.selected[0] = state.selected[1];
  state.selected[1] = id;
  showToast('Swapped in ' + product.name + ' for ' + bumped);
  renderAll();
}

/* ---------- Theme ---------- */
function applyThemeColor() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (els.themeColorMeta) els.themeColorMeta.setAttribute('content', isDark ? '#100e17' : '#faf9fb');
}

/* ---------- Event bindings ---------- */
function bindEvents() {
  els.searchInput.addEventListener('input', function (e) {
    state.search = e.target.value;
    renderProductGrid();
  });

  els.sortSelect.addEventListener('change', function (e) {
    state.sort = e.target.value;
    renderProductGrid();
  });

  els.categoryPills.addEventListener('click', function (e) {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    state.category = btn.dataset.category;
    renderCategoryPills();
    renderProductGrid();
  });

  els.productGrid.addEventListener('click', function (e) {
    const card = e.target.closest('.product-card');
    if (!card) return;
    selectProduct(Number(card.dataset.id));
  });

  els.productGrid.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.product-card');
    if (!card) return;
    e.preventDefault();
    selectProduct(Number(card.dataset.id));
  });

  els.compareTray.addEventListener('click', function (e) {
    const removeBtn = e.target.closest('.tray-remove');
    if (removeBtn) selectProduct(Number(removeBtn.dataset.id));
  });

  els.comparisonPanels.addEventListener('click', function (e) {
    const removeBtn = e.target.closest('.panel-remove');
    if (removeBtn) selectProduct(Number(removeBtn.dataset.id));
  });

  els.swapBtn.addEventListener('click', function () {
    if (els.swapBtn.disabled) return;
    const tmp = state.selected[0];
    state.selected[0] = state.selected[1];
    state.selected[1] = tmp;
    renderAll();
  });

  els.viewComparisonBtn.addEventListener('click', function () {
    if (els.viewComparisonBtn.disabled) return;
    safeScrollIntoView(els.comparisonSection, { behavior: 'smooth', block: 'start' });
  });

  els.themeToggle.addEventListener('click', function () {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    applyThemeColor();
  });
}

/* ---------- Init ---------- */
function init() {
  applyThemeColor();
  renderCategoryPills();
  bindEvents();
  renderAll();
}

init();
