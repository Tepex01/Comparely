/* ==========================================================================
   Comparely — Assistant: guided recommendation engine
   Fully offline. No AI backend, no external API calls. Every answer walks a
   branching question tree (FLOWS below); once a flow ends, real products are
   scored dynamically against the answers using each product's own `scores`
   metadata from products.js (never hardcoded per-product answers). Depends
   on: products.js (PRODUCTS) and common.js (ICONS, CATEGORY_ICONS,
   CATEGORY_GRADIENTS, getProduct, fmtPrice, fmtCount, starsHTML, showToast,
   raf). Load order: products.js -> common.js -> assistant.js.
   ========================================================================== */

/* ---------- Device types ---------- */
const DEVICE_OPTIONS = [
  { category: 'Smartphones', label: 'Phone' },
  { category: 'Laptops', label: 'Laptop' },
  { category: 'Tablets', label: 'Tablet' },
  { category: 'Headphones', label: 'Headphones' },
  { category: 'Smartwatches', label: 'Watch' }
];

/* ---------- Budget ranges per device (upper bound is a hard ceiling) ---------- */
const BUDGET_RANGES = {
  Laptops: { '< $500': [0, 500], '$500–800': [500, 800], '$800–1200': [800, 1200], '$1200–1600': [1200, 1600], '$1600–2200': [1600, 2200], '$2200+': [2200, Infinity] },
  Smartphones: { '< $300': [0, 300], '$300–500': [300, 500], '$500–800': [500, 800], '$800–1200': [800, 1200], '$1200–1600': [1200, 1600], '$1600+': [1600, Infinity] },
  Tablets: { 'Under $300': [0, 300], '$300–600': [300, 600], '$600–900': [600, 900], '$900–1200': [900, 1200], '$1200+': [1200, Infinity] },
  Smartwatches: { 'Under $200': [0, 200], '$200–350': [200, 350], '$350–500': [350, 500], '$500–800': [500, 800], '$800+': [800, Infinity] },
  Headphones: { 'Under $100': [0, 100], '$100–200': [100, 200], '$200–350': [200, 350], '$350–500': [350, 500], '$500+': [500, Infinity] }
};

/* ---------- Question flows (branching: `next` can be a fixed id or a function) ---------- */
const FLOWS = {
  Laptops: [
    { id: 'persona', text: 'What best describes you?', options: ['High School Student', 'College Student', 'Working Professional', 'Content Creator', 'Photographer', 'Business Owner', 'Engineer', 'Gamer', 'Traveler', 'Other'],
      next: function (v) { return /Student/.test(v) ? 'major' : 'budget'; } },
    { id: 'major', text: 'What is your major?', options: ['Business', 'Computer Science', 'Engineering', 'Architecture', 'Graphic Design', 'Video Editing', 'Music', 'Education', 'Health', 'Law', 'Science', 'Other'], next: 'budget' },
    { id: 'budget', text: 'What is your budget?', options: ['< $500', '$500–800', '$800–1200', '$1200–1600', '$1600–2200', '$2200+'], next: 'travel' },
    { id: 'travel', text: 'Do you travel frequently?', options: ['Every day', 'Sometimes', 'Rarely', 'Never'], next: 'batteryImportance' },
    { id: 'batteryImportance', text: 'How important is battery life?', options: ['Very important', 'Somewhat important', "Doesn't matter"], next: 'performanceNeed' },
    { id: 'performanceNeed', text: 'What will you mainly do with it?', options: ['Basic browsing', 'Office work', 'Programming', 'Video editing', '3D rendering', 'Engineering', 'Machine learning', 'Music production', 'Professional creative work'], next: 'weightImportance' },
    { id: 'weightImportance', text: 'How important is weight?', options: ['Very important', 'Somewhat important', "Doesn't matter"], next: 'portsNeeded' },
    { id: 'portsNeeded', text: 'What ports do you need?', options: ['Lots of ports (USB-A, HDMI, SD card)', 'A few essentials', 'Minimal — mostly wireless'], next: 'osPreference' },
    { id: 'osPreference', text: 'Windows or macOS preference?', options: ['macOS', 'Windows', 'Either'], next: 'touchscreen' },
    { id: 'touchscreen', text: 'Do you want a touchscreen?', options: ['Yes please', 'No preference', 'No thanks'], next: 'ramUpgradeable' },
    { id: 'ramUpgradeable', text: 'Is upgradeable RAM important?', options: ['Yes', 'No preference'], next: 'dedicatedGPU' },
    { id: 'dedicatedGPU', text: 'Do you need a dedicated GPU?', options: ['Yes', 'No', 'Not sure'], next: null }
  ],
  Smartphones: [
    { id: 'persona', text: 'What best describes you?', options: ['High School Student', 'College Student', 'Working Professional', 'Content Creator', 'Photographer', 'Business Owner', 'Parent', 'Traveler', 'Gamer', 'Other'],
      next: function (v) { return /Student/.test(v) ? 'major' : 'budget'; } },
    { id: 'major', text: 'What is your major?', options: ['Business', 'Computer Science', 'Engineering', 'Architecture', 'Graphic Design', 'Video Editing', 'Music', 'Education', 'Health', 'Law', 'Science', 'Other'], next: 'budget' },
    { id: 'budget', text: 'What is your budget?', options: ['< $300', '$300–500', '$500–800', '$800–1200', '$1200–1600', '$1600+'], next: 'battery' },
    { id: 'battery', text: 'How important is battery life?', options: ['Very important', 'Somewhat important', "Doesn't matter"], next: 'camera' },
    { id: 'camera', text: 'How important is the camera?', options: ['Very important', 'Normal', "Don't care"], next: 'gaming' },
    { id: 'gaming', text: 'Do you play games on your phone?', options: ['Yes', 'Sometimes', 'Never'], next: 'ecosystem' },
    { id: 'ecosystem', text: 'Apple ecosystem?', options: ['Already own Apple devices', 'Thinking about Apple', "Don't care", 'Android user'], next: 'storage' },
    { id: 'storage', text: 'How much storage do you need?', options: ['128', '256', '512', '1TB'], next: 'screenSize' },
    { id: 'screenSize', text: 'Preferred screen size?', options: ['Compact', 'Large', 'No preference'], next: null }
  ],
  Tablets: [
    { id: 'usage', text: 'What will you mainly use it for?', options: ['Drawing & Art', 'School & Note-taking', 'Media & Streaming', 'Business & Productivity', 'Gaming'], next: 'portability' },
    { id: 'portability', text: 'How important is portability?', options: ['Very important', 'Somewhat important', "Doesn't matter"], next: 'keyboard' },
    { id: 'keyboard', text: 'Will you use it with a keyboard?', options: ['Yes, often', 'Occasionally', 'No, just the tablet'], next: 'budget' },
    { id: 'budget', text: 'What is your budget?', options: ['Under $300', '$300–600', '$600–900', '$900–1200', '$1200+'], next: null }
  ],
  Smartwatches: [
    { id: 'usage', text: 'What matters most to you?', options: ['Fitness & Workouts', 'Running & Sports', 'Health Tracking', 'Notifications', 'Battery Life'], next: 'phoneType' },
    { id: 'phoneType', text: 'iPhone or Android?', options: ['iPhone', 'Android', 'Either'], next: 'budget' },
    { id: 'budget', text: 'What is your budget?', options: ['Under $200', '$200–350', '$350–500', '$500–800', '$800+'], next: null }
  ],
  Headphones: [
    { id: 'usage', text: 'What will you use them for most?', options: ['Travel & Commuting', 'Workouts & Gym', 'Gaming', 'Calls & Meetings', 'Everyday Listening'], next: 'form' },
    { id: 'form', text: 'Over-ear or earbuds?', options: ['Over-ear', 'Earbuds', 'No preference'], next: 'noiseCancelling' },
    { id: 'noiseCancelling', text: 'How important is noise cancelling?', options: ['Very important', 'Somewhat important', "Doesn't matter"], next: 'ecosystem' },
    { id: 'ecosystem', text: 'Apple ecosystem?', options: ['Already own Apple devices', 'Android user', "Don't care"], next: 'budget' },
    { id: 'budget', text: 'What is your budget?', options: ['Under $100', '$100–200', '$200–350', '$350–500', '$500+'], next: null }
  ]
};

/* ---------- Scoring: dynamic, driven by each product's own `scores` metadata ---------- */
function parseStorageGB(v) {
  if (!v) return null;
  const s = String(v);
  const tb = s.match(/([\d.]+)\s*TB/i);
  if (tb) return parseFloat(tb[1]) * 1024;
  const m = s.match(/[\d.]+/);
  return m ? parseFloat(m[0]) : null;
}

function scoreLaptop(p, a) {
  let score = 0; const reasons = [];
  function add(pts, text) { score += pts; if (pts > 0 && text) reasons.push({ text: text, pts: pts }); }
  const s = p.scores;

  if (/High School Student|College Student/.test(a.persona)) add(s.student, 'Great fit for student life — portable and good value');
  if (a.persona === 'Working Professional' || a.persona === 'Business Owner') add(s.business, 'Well suited for professional, everyday business use');
  if (a.persona === 'Content Creator' || a.persona === 'Photographer') add(s.creator, 'Strong choice for creative work');
  if (a.persona === 'Gamer') add(s.gaming, 'Handles gaming well');
  if (a.persona === 'Traveler') add(s.travel, 'Built for life on the move');

  if (a.major === 'Business' || a.major === 'Law' || a.major === 'Education') add(Math.round(s.business * 0.6), 'Fits well with business-oriented coursework');
  if (a.major === 'Computer Science' || a.major === 'Engineering' || a.major === 'Science') add(Math.round(s.performance * 0.6), 'Enough performance for coding and technical coursework');
  if (a.major === 'Graphic Design' || a.major === 'Video Editing' || a.major === 'Music' || a.major === 'Architecture') add(Math.round(s.creator * 0.6), 'Good fit for creative coursework');

  if (a.travel === 'Every day' || a.travel === 'Sometimes') add(s.travel, 'Long battery life and light weight help on the go');

  if (a.batteryImportance === 'Very important') add(s.battery * 2, 'Battery life is among the best in its category');
  else if (a.batteryImportance === 'Somewhat important') add(s.battery, 'Solid battery life');

  const heavy = ['Video editing', '3D rendering', 'Engineering', 'Machine learning', 'Music production', 'Professional creative work'];
  if (heavy.indexOf(a.performanceNeed) !== -1) add(s.performance * 2, 'Strong enough performance for demanding workloads');
  else if (a.performanceNeed === 'Programming') add(Math.round(s.performance * 1.5), 'Comfortably handles development work');
  else if (a.performanceNeed === 'Office work') add(Math.round(s.performance * 0.8), 'More than enough for office work');

  if (a.weightImportance === 'Very important') add(s.portability * 2, 'Noticeably lighter than most laptops in its class');
  else if (a.weightImportance === 'Somewhat important') add(s.portability, 'Reasonably portable');

  if (a.portsNeeded === 'Lots of ports (USB-A, HDMI, SD card)' && p.brand !== 'Apple' && !/Zenbook S|XPS 13\b/.test(p.name)) add(3, 'Offers a fuller port selection');

  if (a.osPreference === 'macOS') { if (s.ecosystem === 'apple') add(10, 'Runs macOS as you prefer'); else score -= 8; }
  else if (a.osPreference === 'Windows') { if (s.ecosystem !== 'apple') add(10, 'Runs Windows as you prefer'); else score -= 8; }

  if (a.touchscreen === 'Yes please' && /Yoga|Spectre x360|Surface|Zenbook Duo|Envy x360/i.test(p.name)) add(5, 'Touchscreen or 2-in-1 design as you wanted');

  if (a.dedicatedGPU === 'Yes' && /RTX/.test(p.specs.GPU || '')) add(8, 'Comes with a dedicated GPU as you need');

  return { total: score, reasons: reasons };
}

function scorePhone(p, a) {
  let score = 0; const reasons = [];
  function add(pts, text) { score += pts; if (pts > 0 && text) reasons.push({ text: text, pts: pts }); }
  const s = p.scores;

  if (a.persona === 'Photographer' || a.persona === 'Content Creator') add(s.camera * 2, 'Camera system built for photography and content creation');
  if (a.persona === 'Business Owner' || a.persona === 'Working Professional') add(s.business, 'Polished, professional feel');
  if (a.persona === 'Gamer') add(Math.round(s.gaming * 1.5), 'Performance built for gaming');
  if (a.persona === 'Traveler') add(s.travel, 'Reliable battery life for travel');
  if (a.persona === 'Parent') add(s.value, 'Reliable, good all-around value');

  if (a.battery === 'Very important') add(s.battery * 2, 'Battery life stands out in this category');
  else if (a.battery === 'Somewhat important') add(s.battery, 'Solid battery life');

  if (a.camera === 'Very important') add(s.camera * 2, 'One of the stronger camera systems available');
  else if (a.camera === 'Normal') add(Math.round(s.camera * 0.8), 'Capable, well-rounded camera');

  if (a.gaming === 'Yes') add(Math.round(s.gaming * 1.5), 'Handles gaming smoothly');
  else if (a.gaming === 'Sometimes') add(s.gaming, 'Handles casual gaming fine');

  if (a.ecosystem === 'Already own Apple devices') { if (s.ecosystem === 'apple') add(12, 'Fits right into your Apple ecosystem'); else score -= 10; }
  else if (a.ecosystem === 'Android user') { if (s.ecosystem !== 'apple') add(12, 'Stays in the Android ecosystem you know'); else score -= 10; }
  else if (a.ecosystem === 'Thinking about Apple' && s.ecosystem === 'apple') add(4, 'A good entry point into the Apple ecosystem');

  const gb = parseStorageGB(p.specs.Storage);
  if (a.storage === '1TB' && gb >= 512) add(5, 'Generous storage for your needs');
  else if (a.storage === '512' && gb >= 256) add(4, 'Plenty of storage');

  if (a.screenSize === 'Compact' && s.portability >= 6) add(4, 'Compact, comfortable size');
  else if (a.screenSize === 'Large' && s.portability < 6) add(4, 'Bigger screen, as you wanted');

  return { total: score, reasons: reasons };
}

function scoreTablet(p, a) {
  let score = 0; const reasons = [];
  function add(pts, text) { score += pts; if (pts > 0 && text) reasons.push({ text: text, pts: pts }); }
  const s = p.scores;

  if (a.usage === 'Drawing & Art' && /Pro|Tab S9 Ultra|Tab S8 Ultra|Tab P12 Pro/.test(p.name)) add(7, 'Great pairing with a stylus for drawing');
  if (a.usage === 'School & Note-taking') add(s.student, 'Good balance of price and note-taking features');
  if (a.usage === 'Media & Streaming') add(Math.round(s.creator * 0.7) || 5, 'Vivid display, great for video');
  if (a.usage === 'Business & Productivity') add(s.business, 'Built for productivity workflows');
  if (a.usage === 'Gaming') add(s.gaming, 'Strong performance for gaming');

  if (a.portability === 'Very important') add(s.portability * 2, 'Light and easy to carry');
  else if (a.portability === 'Somewhat important') add(s.portability, 'Reasonably portable');

  if (a.keyboard === 'Yes, often' && /Pro|Surface|Tab S9|Tab S8|Tab P12/.test(p.name)) add(4, 'Pairs well with a keyboard for productivity');

  return { total: score, reasons: reasons };
}

function scoreWatch(p, a) {
  let score = 0; const reasons = [];
  function add(pts, text) { score += pts; if (pts > 0 && text) reasons.push({ text: text, pts: pts }); }
  const s = p.scores;

  if (a.usage === 'Fitness & Workouts' && /Venu|Forerunner|Watch Ultra|Versa|Fenix/.test(p.name)) add(7, 'Built for fitness tracking');
  if (a.usage === 'Running & Sports' && /Forerunner|Fenix|Venu|Ultra/.test(p.name)) add(7, 'Strong GPS and running features');
  if (a.usage === 'Health Tracking' && /Sense|Watch Series|Fenix|Charge/.test(p.name)) add(6, 'Detailed health metrics');
  if (a.usage === 'Notifications' && (s.ecosystem === 'apple' || /Galaxy Watch|Pixel Watch/.test(p.name))) add(5, 'Rich smartwatch notifications and apps');
  if (a.usage === 'Battery Life') add(s.battery * 2, 'Long battery life between charges');

  if (a.phoneType === 'iPhone') { if (s.ecosystem === 'apple') add(12, 'Works natively with your iPhone'); else score -= 10; }
  else if (a.phoneType === 'Android') { if (s.ecosystem !== 'apple') add(12, 'Works with your Android phone'); else score -= 10; }

  return { total: score, reasons: reasons };
}

function scoreHeadphones(p, a) {
  let score = 0; const reasons = [];
  function add(pts, text) { score += pts; if (pts > 0 && text) reasons.push({ text: text, pts: pts }); }

  if (a.usage === 'Travel & Commuting' && p.specs['Noise Cancelling'] === 'Yes') add(7, 'Active noise cancellation is great for travel');
  if (a.usage === 'Workouts & Gym' && p.specs.Type === 'In-ear') add(6, 'Secure in-ear fit for workouts');
  if (a.usage === 'Gaming' && /5\.[23]/.test(p.specs.Bluetooth || '')) add(3, 'Modern Bluetooth for lower latency');
  if (a.usage === 'Calls & Meetings' && /AirPods Pro|WF-1000XM|QuietComfort Earbuds|Momentum True Wireless|Buds/.test(p.name)) add(5, 'Clear microphone quality for calls');
  if (a.usage === 'Everyday Listening' && p.rating >= 4.5) add(4, 'Highly rated for everyday listening');

  if (a.form === 'Over-ear' && p.specs.Type === 'Over-ear') add(5, 'Over-ear design, as you wanted');
  else if (a.form === 'Earbuds' && p.specs.Type === 'In-ear') add(5, 'Compact earbud design, as you wanted');

  if (a.noiseCancelling === 'Very important') { if (p.specs['Noise Cancelling'] === 'Yes') add(8, 'Strong active noise cancellation'); else score -= 6; }
  else if (a.noiseCancelling === 'Somewhat important' && p.specs['Noise Cancelling'] === 'Yes') add(3, 'Includes noise cancellation');

  if (a.ecosystem === 'Already own Apple devices' && /Apple|Beats/.test(p.brand)) add(6, 'Pairs seamlessly with your Apple devices');
  else if (a.ecosystem === 'Android user' && p.brand !== 'Apple') add(4, 'Works great with Android');

  return { total: score, reasons: reasons };
}

function scoreProductForCategory(category, p, a) {
  if (category === 'Laptops') return scoreLaptop(p, a);
  if (category === 'Smartphones') return scorePhone(p, a);
  if (category === 'Tablets') return scoreTablet(p, a);
  if (category === 'Smartwatches') return scoreWatch(p, a);
  if (category === 'Headphones') return scoreHeadphones(p, a);
  return { total: 0, reasons: [] };
}

function getBudgetRange(category, budgetAnswer) {
  const map = BUDGET_RANGES[category];
  return (map && map[budgetAnswer]) || [0, Infinity];
}

function computeRecommendations(category, answers) {
  const range = getBudgetRange(category, answers.budget);
  const candidates = PRODUCTS.filter(function (p) { return p.category === category && p.price <= range[1]; });
  const scored = candidates.map(function (p) {
    const r = scoreProductForCategory(category, p, answers);
    return { product: p, total: r.total, reasons: r.reasons };
  });
  scored.sort(function (x, y) { return y.total - x.total; });
  if (scored.length === 0) return [];

  const picks = [scored[0]];
  if (scored.length > 1) picks.push(scored[1]);
  if (scored.length > 2) {
    const pool = scored.slice(0, Math.min(6, scored.length)).filter(function (r) { return picks.indexOf(r) === -1; });
    if (pool.length) {
      const cheapest = pool.slice().sort(function (x, y) { return x.product.price - y.product.price; })[0];
      picks.push(cheapest);
    }
  }

  const topScore = picks[0].total > 0 ? picks[0].total : 1;
  return picks.map(function (r, i) {
    const match = Math.max(65, Math.min(99, Math.round(65 + (Math.max(r.total, 0) / topScore) * 34)));
    let reasonTexts = r.reasons.slice().sort(function (x, y) { return y.pts - x.pts; }).map(function (x) { return x.text; });
    reasonTexts = reasonTexts.filter(function (t, idx) { return reasonTexts.indexOf(t) === idx; });
    if (reasonTexts.length < 3) {
      if (r.product.rating >= 4.5) reasonTexts.push('Highly rated by other buyers');
      reasonTexts.push('A solid all-around choice based on your answers');
    }
    return {
      product: r.product,
      match: match,
      reasons: reasonTexts.slice(0, 5),
      label: i === 0 ? 'Best Match' : (i === 1 ? 'Runner Up' : 'Budget Pick')
    };
  });
}

/* ---------- Human-readable summary of answers ---------- */
function buildSummary(category, a) {
  const lines = [];
  if (category === 'Laptops') {
    if (a.persona) lines.push('You described yourself as a ' + a.persona.toLowerCase() + '.');
    if (a.major) lines.push('You study ' + a.major + '.');
    if (a.travel) lines.push('You travel ' + a.travel.toLowerCase() + '.');
    if (a.batteryImportance) lines.push('Battery life is ' + a.batteryImportance.toLowerCase() + ' to you.');
    if (a.performanceNeed) lines.push('Your main use is ' + a.performanceNeed.toLowerCase() + '.');
    if (a.weightImportance) lines.push('Weight is ' + a.weightImportance.toLowerCase() + ' to you.');
    if (a.osPreference) lines.push('You prefer ' + a.osPreference + '.');
    if (a.dedicatedGPU === 'Yes') lines.push('You need a dedicated GPU.');
    if (a.budget) lines.push('Your budget is ' + a.budget + '.');
  } else if (category === 'Smartphones') {
    if (a.persona) lines.push('You described yourself as a ' + a.persona.toLowerCase() + '.');
    if (a.major) lines.push('You study ' + a.major + '.');
    if (a.ecosystem) lines.push(a.ecosystem + '.');
    if (a.battery) lines.push('Battery life is ' + a.battery.toLowerCase() + ' to you.');
    if (a.camera) lines.push('Camera quality is ' + a.camera.toLowerCase() + ' to you.');
    if (a.budget) lines.push('Your budget is ' + a.budget + '.');
  } else if (category === 'Tablets') {
    if (a.usage) lines.push('You mainly want it for ' + a.usage.toLowerCase() + '.');
    if (a.portability) lines.push('Portability is ' + a.portability.toLowerCase() + ' to you.');
    if (a.keyboard) lines.push('Keyboard use: ' + a.keyboard.toLowerCase() + '.');
    if (a.budget) lines.push('Your budget is ' + a.budget + '.');
  } else if (category === 'Smartwatches') {
    if (a.usage) lines.push(a.usage + ' matters most to you.');
    if (a.phoneType) lines.push('You use ' + a.phoneType + '.');
    if (a.budget) lines.push('Your budget is ' + a.budget + '.');
  } else if (category === 'Headphones') {
    if (a.usage) lines.push('You mainly want them for ' + a.usage.toLowerCase() + '.');
    if (a.form) lines.push('Preferred fit: ' + a.form.toLowerCase() + '.');
    if (a.noiseCancelling) lines.push('Noise cancelling is ' + a.noiseCancelling.toLowerCase() + ' to you.');
    if (a.budget) lines.push('Your budget is ' + a.budget + '.');
  }
  return lines;
}

/* ---------- Flow state ---------- */
const flowState = { category: null, step: 'device-select', answers: {}, history: [] };
const sessionHistory = [];

function startFlow(category) {
  flowState.category = category;
  flowState.answers = {};
  flowState.history = [];
  flowState.step = FLOWS[category][0].id;
  render();
}

function answerQuestion(questionId, value) {
  flowState.answers[questionId] = value;
  if (flowState.history[flowState.history.length - 1] !== questionId) flowState.history.push(questionId);
  const q = FLOWS[flowState.category].find(function (x) { return x.id === questionId; });
  const nextId = typeof q.next === 'function' ? q.next(value, flowState.answers) : q.next;
  if (nextId === null || nextId === undefined) {
    finishFlow();
  } else {
    flowState.step = nextId;
    render();
  }
}

function finishFlow() {
  const results = computeRecommendations(flowState.category, flowState.answers);
  sessionHistory.unshift({
    id: 'h' + Date.now(),
    category: flowState.category,
    deviceLabel: (DEVICE_OPTIONS.find(function (d) { return d.category === flowState.category; }) || {}).label || flowState.category,
    answers: Object.assign({}, flowState.answers),
    results: results
  });
  flowState.step = 'results';
  render();
}

function goBack() {
  if (flowState.step === 'results') {
    flowState.step = flowState.history[flowState.history.length - 1];
    render();
    return;
  }
  const idx = flowState.history.indexOf(flowState.step);
  if (idx > 0) {
    delete flowState.answers[flowState.step];
    flowState.history.pop();
    flowState.step = flowState.history[flowState.history.length - 1];
    render();
  } else {
    resetToDeviceSelect();
  }
}

function resetToDeviceSelect() {
  flowState.category = null;
  flowState.step = 'device-select';
  flowState.answers = {};
  flowState.history = [];
  render();
}

/* ---------- Rendering ---------- */
const els = {
  sidebar: document.getElementById('assistantSidebar'),
  sidebarToggle: document.getElementById('sidebarToggle'),
  sidebarOverlay: document.getElementById('sidebarOverlay'),
  newConvoBtn: document.getElementById('newConvoBtn'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  historyList: document.getElementById('historyList'),
  flowArea: document.getElementById('flowArea')
};

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function deviceSelectHTML() {
  return (
    '<div class="qa-screen qa-device-select">' +
      '<div class="qa-intro"><h2>What are you shopping for?</h2><p>Answer a few quick questions and I\u2019ll recommend your best matches — no account, no AI backend, just real product data.</p></div>' +
      '<div class="device-grid">' +
        DEVICE_OPTIONS.map(function (d) {
          return '<button type="button" class="device-card" data-category="' + d.category + '">' +
            '<span class="device-icon" style="background:' + CATEGORY_GRADIENTS[d.category] + '">' + CATEGORY_ICONS[d.category] + '</span>' +
            '<span class="device-label">' + d.label + '</span>' +
          '</button>';
        }).join('') +
      '</div>' +
    '</div>'
  );
}

function questionHTML() {
  const q = FLOWS[flowState.category].find(function (x) { return x.id === flowState.step; });
  const total = FLOWS[flowState.category].length;
  const idx = flowState.history.indexOf(flowState.step) + 1;
  const shownIdx = idx > 0 ? idx : flowState.history.length + 1;
  const pct = Math.min(100, Math.round(((shownIdx - 1) / total) * 100));
  return (
    '<div class="qa-screen qa-question">' +
      '<div class="qa-progress"><div class="qa-progress-bar" style="width:' + pct + '%"></div></div>' +
      '<p class="qa-step-label">Question ' + shownIdx + '</p>' +
      '<h2>' + escapeHTML(q.text) + '</h2>' +
      '<div class="qa-options">' +
        q.options.map(function (opt) {
          const selected = flowState.answers[q.id] === opt;
          return '<button type="button" class="qa-option' + (selected ? ' selected' : '') + '" data-qid="' + q.id + '" data-value="' + escapeHTML(opt) + '">' + escapeHTML(opt) + '</button>';
        }).join('') +
      '</div>' +
      '<button type="button" class="qa-back" id="qaBackBtn">\u2190 Back</button>' +
    '</div>'
  );
}

function recCardHTML(r, i, allResults) {
  const p = r.product;
  const other = i === 0 ? allResults[1] : allResults[0];
  return (
    '<div class="rec-card' + (i === 0 ? ' rec-best' : '') + '">' +
      '<span class="rec-label">' + r.label + '</span>' +
      '<div class="rec-media" style="background:' + CATEGORY_GRADIENTS[p.category] + '">' + CATEGORY_ICONS[p.category] + '</div>' +
      '<div class="rec-match"><span class="rec-match-value">' + r.match + '%</span><span class="rec-match-label">Match</span></div>' +
      '<span class="rec-brand">' + p.brand + '</span>' +
      '<h3 class="rec-name">' + p.name + '</h3>' +
      '<div class="rec-rating">' + starsHTML(p.rating) + '<span class="rating-count">(' + fmtCount(p.reviews) + ')</span></div>' +
      '<div class="rec-price">' + fmtPrice(p.price) + '</div>' +
      '<div class="rec-reasons"><h4>Why we picked this</h4><ul>' + r.reasons.map(function (x) { return '<li>' + escapeHTML(x) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="rec-proscons">' +
        '<div><h5>Pros</h5><ul class="pros-list">' + p.pros.map(function (x) { return '<li>' + escapeHTML(x) + '</li>'; }).join('') + '</ul></div>' +
        '<div><h5>Potential downsides</h5><ul class="cons-list">' + p.cons.map(function (x) { return '<li>' + escapeHTML(x) + '</li>'; }).join('') + '</ul></div>' +
      '</div>' +
      '<div class="rec-actions">' +
        (other ? '<a class="btn-rec-compare" href="compare.html?a=' + p.id + '&b=' + other.product.id + '">Compare</a>' : '') +
        '<a class="btn-rec-view" href="compare.html?a=' + p.id + '">View Product</a>' +
      '</div>' +
    '</div>'
  );
}

function resultsHTML(entry) {
  const category = entry ? entry.category : flowState.category;
  const answers = entry ? entry.answers : flowState.answers;
  const results = entry ? entry.results : computeRecommendations(flowState.category, flowState.answers);
  const summaryLines = buildSummary(category, answers);
  return (
    '<div class="qa-screen qa-results">' +
      (entry ? '' : '<button type="button" class="qa-back" id="qaBackBtn">\u2190 Back</button>') +
      '<div class="qa-summary">' +
        '<h3>Based on your answers\u2026</h3>' +
        (summaryLines.length ? '<ul>' + summaryLines.map(function (l) { return '<li>' + escapeHTML(l) + '</li>'; }).join('') + '</ul>' : '') +
        '<p class="qa-summary-conclusion">Because of those requirements, here are your best matches.</p>' +
      '</div>' +
      (results.length === 0
        ? '<div class="qa-empty">No products matched your budget and preferences. Try a wider budget or different answers.</div>'
        : '<div class="rec-grid">' + results.map(function (r, i) { return recCardHTML(r, i, results); }).join('') + '</div>'
      ) +
      '<button type="button" class="btn btn-primary qa-restart" id="qaRestartBtn">Start Over</button>' +
    '</div>'
  );
}

function render() {
  let html;
  if (flowState.step === 'device-select') html = deviceSelectHTML();
  else if (flowState.step === 'results') html = resultsHTML(null);
  else html = questionHTML();
  els.flowArea.innerHTML = html;
  raf(function () { els.flowArea.scrollTop = 0; });
  renderHistory();
}

function renderHistory() {
  if (!els.historyList) return;
  if (sessionHistory.length === 0) {
    els.historyList.innerHTML = '<div class="sidebar-empty">Start your first buying conversation.</div>';
    return;
  }
  els.historyList.innerHTML = sessionHistory.map(function (h) {
    const top = h.results[0];
    return '<button type="button" class="history-item" data-id="' + h.id + '">' +
      '<span class="history-item-device">' + h.deviceLabel + '</span>' +
      '<span class="history-item-name">' + (top ? top.product.name : 'No match') + '</span>' +
    '</button>';
  }).join('');
}

function viewHistoryEntry(id) {
  const entry = sessionHistory.find(function (h) { return h.id === id; });
  if (!entry) return;
  els.flowArea.innerHTML = resultsHTML(entry);
  raf(function () { els.flowArea.scrollTop = 0; });
}

/* ---------- Event bindings ---------- */
function bindEvents() {
  els.flowArea.addEventListener('click', function (e) {
    const deviceBtn = e.target.closest('.device-card');
    if (deviceBtn) { startFlow(deviceBtn.dataset.category); return; }

    const optBtn = e.target.closest('.qa-option');
    if (optBtn) { answerQuestion(optBtn.dataset.qid, optBtn.dataset.value); return; }

    const backBtn = e.target.closest('#qaBackBtn');
    if (backBtn) { goBack(); return; }

    const restartBtn = e.target.closest('#qaRestartBtn');
    if (restartBtn) { resetToDeviceSelect(); showToast('Starting a new search'); return; }
  });

  if (els.historyList) {
    els.historyList.addEventListener('click', function (e) {
      const item = e.target.closest('.history-item');
      if (item) viewHistoryEntry(item.dataset.id);
    });
  }

  if (els.newConvoBtn) {
    els.newConvoBtn.addEventListener('click', function () {
      resetToDeviceSelect();
      showToast('New search started');
    });
  }

  if (els.clearHistoryBtn) {
    els.clearHistoryBtn.addEventListener('click', function () {
      sessionHistory.length = 0;
      renderHistory();
      showToast('History cleared');
    });
  }

  if (els.settingsBtn) {
    els.settingsBtn.addEventListener('click', function () {
      showToast('Settings are coming in a future update');
    });
  }
}

function initSidebarToggle() {
  const btn = els.sidebarToggle;
  const sidebar = els.sidebar;
  const overlay = els.sidebarOverlay;
  if (!btn || !sidebar) return;
  function close() { sidebar.classList.remove('open'); if (overlay) overlay.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
  function open() { sidebar.classList.add('open'); if (overlay) overlay.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
  btn.addEventListener('click', function () { sidebar.classList.contains('open') ? close() : open(); });
  if (overlay) overlay.addEventListener('click', close);
}

/* ---------- Init ---------- */
function init() {
  if (typeof PRODUCTS === 'undefined' || !Array.isArray(PRODUCTS)) {
    console.error('Comparely: PRODUCTS is not defined. Make sure products.js loads before assistant.js.');
    return;
  }
  bindEvents();
  initSidebarToggle();
  render();
}

init();
