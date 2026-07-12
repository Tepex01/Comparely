/* ==========================================================================
   Comparely — Assistant page logic
   Depends on: common.js (ICONS, showToast, raf). products.js is NOT loaded
   on this page — reply text only matches category keywords, it does not
   look up real product records. There is no AI backend yet: replies are
   deliberately-labeled stub text so the interface is honest about what it
   is, while every interaction (send, stop, regenerate, copy, like/dislike,
   auto-resize, auto-scroll) is fully wired up for real AI to slot in later.
   ========================================================================== */

const SUGGESTIONS = [
  'Compare iPhone vs Galaxy',
  'Best laptop under $1,500',
  'Best headphones for travel',
  'Compare MacBook Air vs MacBook Pro',
  'Best smartwatch for fitness',
  'Find the best gaming laptop',
  'Recommend a tablet for college',
  'Which earbuds have the best ANC?'
];

const STUB_INTROS = [
  "I'm still a developer preview, so I can't reason over live product data yet.",
  "Good question \u2014 I don't have real AI-powered answers in this preview yet.",
  "Thanks for asking. Real-time recommendations are coming in a future update."
];

const chatState = {
  messages: [],
  isGenerating: false,
  pendingTimer: null
};

let idCounter = 0;
function nextId() { idCounter += 1; return 'm' + Date.now() + '-' + idCounter; }

const els = {
  sidebar: document.getElementById('assistantSidebar'),
  sidebarToggle: document.getElementById('sidebarToggle'),
  sidebarOverlay: document.getElementById('sidebarOverlay'),
  newConvoBtn: document.getElementById('newConvoBtn'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  welcomeScreen: document.getElementById('welcomeScreen'),
  suggestionGrid: document.getElementById('suggestionGrid'),
  messagesEl: document.getElementById('chatMessages'),
  textarea: document.getElementById('chatInput'),
  sendBtn: document.getElementById('sendBtn')
};

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

/* ---------- Stub reply generation (no real AI yet, see file header) ---------- */
function craftReply(userText) {
  const text = userText.toLowerCase();
  let category = null;
  if (/phone|iphone|galaxy|pixel|xiaomi|oneplus/.test(text)) category = 'Smartphones';
  else if (/laptop|macbook|thinkpad|zenbook|surface laptop|notebook/.test(text)) category = 'Laptops';
  else if (/headphone|earbud|airpod|\banc\b|earphone/.test(text)) category = 'Headphones';
  else if (/watch|fitness tracker/.test(text)) category = 'Smartwatches';
  else if (/tablet|ipad/.test(text)) category = 'Tablets';

  const intro = STUB_INTROS[Math.floor(Math.random() * STUB_INTROS.length)];
  const body = " For now, head to the Compare page \u2014 search two products and I'll break down price, specs, features, and the winner in every category.";
  const cta = category
    ? { href: 'compare.html?category=' + encodeURIComponent(category), label: 'Open Compare \u2014 ' + category }
    : { href: 'compare.html', label: 'Open Compare' };
  return { text: intro + body, cta: cta };
}

/* ---------- Rendering ---------- */
function userMessageHTML(msg) {
  return (
    '<div class="msg msg-user" data-id="' + msg.id + '">' +
      '<div class="msg-bubble">' + escapeHTML(msg.text) + '</div>' +
      '<div class="msg-meta"><span class="msg-time">' + msg.time + '</span></div>' +
    '</div>'
  );
}

function assistantMessageHTML(msg) {
  return (
    '<div class="msg msg-assistant" data-id="' + msg.id + '">' +
      '<div class="msg-avatar">' + ICONS.messageSquare + '</div>' +
      '<div class="msg-content">' +
        '<div class="msg-bubble">' + escapeHTML(msg.text) +
          (msg.ctaHref ? ('<a class="msg-cta" href="' + msg.ctaHref + '">' + msg.ctaLabel + ' \u2192</a>') : '') +
        '</div>' +
        '<div class="msg-actions">' +
          '<button class="msg-action" data-action="copy" title="Copy" aria-label="Copy response">' + ICONS.copy + '</button>' +
          '<button class="msg-action" data-action="regenerate" title="Regenerate" aria-label="Regenerate response">' + ICONS.refresh + '</button>' +
          '<button class="msg-action' + (msg.liked ? ' active' : '') + '" data-action="like" title="Good response" aria-label="Good response">' + ICONS.thumbsUp + '</button>' +
          '<button class="msg-action' + (msg.disliked ? ' active' : '') + '" data-action="dislike" title="Not helpful" aria-label="Not helpful">' + ICONS.thumbsDown + '</button>' +
          '<span class="msg-time">' + msg.time + '</span>' +
        '</div>' +
      '</div>' +
    '</div>'
  );
}

function typingIndicatorHTML() {
  return (
    '<div class="msg msg-assistant msg-typing" id="typingIndicator">' +
      '<div class="msg-avatar">' + ICONS.messageSquare + '</div>' +
      '<div class="msg-content"><div class="msg-bubble typing-dots"><span></span><span></span><span></span></div></div>' +
    '</div>'
  );
}

function scrollToBottom() {
  raf(function () { els.messagesEl.scrollTop = els.messagesEl.scrollHeight; });
}

function renderMessages() {
  if (chatState.messages.length === 0) {
    els.welcomeScreen.hidden = false;
    els.messagesEl.hidden = true;
    els.messagesEl.innerHTML = '';
    return;
  }
  els.welcomeScreen.hidden = true;
  els.messagesEl.hidden = false;
  els.messagesEl.innerHTML = chatState.messages.map(function (m) {
    return m.role === 'user' ? userMessageHTML(m) : assistantMessageHTML(m);
  }).join('');
  scrollToBottom();
}

function renderSuggestions() {
  if (!els.suggestionGrid) return;
  els.suggestionGrid.innerHTML = SUGGESTIONS.map(function (s) {
    return '<button type="button" class="suggestion-card">' + s + '</button>';
  }).join('');
}

/* ---------- Generating / send-stop button state ---------- */
function updateSendButton() {
  if (chatState.isGenerating) {
    els.sendBtn.innerHTML = ICONS.stop;
    els.sendBtn.classList.add('is-stop');
    els.sendBtn.setAttribute('aria-label', 'Stop generating');
  } else {
    els.sendBtn.innerHTML = ICONS.send;
    els.sendBtn.classList.remove('is-stop');
    els.sendBtn.setAttribute('aria-label', 'Send message');
  }
}

function startGenerating() {
  chatState.isGenerating = true;
  updateSendButton();
  els.messagesEl.hidden = false;
  els.welcomeScreen.hidden = true;
  els.messagesEl.insertAdjacentHTML('beforeend', typingIndicatorHTML());
  scrollToBottom();
}

function stopGenerating() {
  chatState.isGenerating = false;
  updateSendButton();
  const indicator = document.getElementById('typingIndicator');
  if (indicator) indicator.remove();
}

/* ---------- Textarea auto-resize ---------- */
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 160) + 'px';
}

/* ---------- Sending ---------- */
function sendMessage() {
  const text = els.textarea.value.trim();
  if (!text || chatState.isGenerating) return;

  chatState.messages.push({ id: nextId(), role: 'user', text: text, time: formatTime(new Date()) });
  els.textarea.value = '';
  autoResize(els.textarea);
  renderMessages();
  startGenerating();

  chatState.pendingTimer = setTimeout(function () {
    const reply = craftReply(text);
    chatState.messages.push({
      id: nextId(), role: 'assistant', text: reply.text,
      ctaHref: reply.cta.href, ctaLabel: reply.cta.label, time: formatTime(new Date())
    });
    stopGenerating();
    renderMessages();
  }, 900 + Math.random() * 500);
}

function regenerate(msg) {
  if (chatState.isGenerating) return;
  const idx = chatState.messages.indexOf(msg);
  let sourceText = '';
  for (let i = idx - 1; i >= 0; i--) {
    if (chatState.messages[i].role === 'user') { sourceText = chatState.messages[i].text; break; }
  }
  startGenerating();
  chatState.pendingTimer = setTimeout(function () {
    const reply = craftReply(sourceText);
    msg.text = reply.text;
    msg.ctaHref = reply.cta.href;
    msg.ctaLabel = reply.cta.label;
    msg.time = formatTime(new Date());
    msg.liked = false;
    msg.disliked = false;
    stopGenerating();
    renderMessages();
  }, 700 + Math.random() * 400);
}

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      showToast('Copied to clipboard');
    }).catch(function () {
      showToast('Could not copy');
    });
  } else {
    showToast('Copy not supported in this browser');
  }
}

/* ---------- Sidebar (collapses on mobile) ---------- */
function initSidebarToggle() {
  const btn = els.sidebarToggle;
  const sidebar = els.sidebar;
  const overlay = els.sidebarOverlay;
  if (!btn || !sidebar) return;
  function close() {
    sidebar.classList.remove('open');
    if (overlay) overlay.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }
  function open() {
    sidebar.classList.add('open');
    if (overlay) overlay.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
  }
  btn.addEventListener('click', function () {
    if (sidebar.classList.contains('open')) close(); else open();
  });
  if (overlay) overlay.addEventListener('click', close);
}

/* ---------- Event bindings ---------- */
function bindEvents() {
  els.sendBtn.addEventListener('click', function () {
    if (chatState.isGenerating) {
      clearTimeout(chatState.pendingTimer);
      stopGenerating();
      showToast('Stopped generating');
    } else {
      sendMessage();
    }
  });

  els.textarea.addEventListener('input', function () { autoResize(els.textarea); });
  els.textarea.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!chatState.isGenerating) sendMessage();
    }
  });

  if (els.suggestionGrid) {
    els.suggestionGrid.addEventListener('click', function (e) {
      const btn = e.target.closest('.suggestion-card');
      if (!btn) return;
      els.textarea.value = btn.textContent;
      autoResize(els.textarea);
      els.textarea.focus();
    });
  }

  els.messagesEl.addEventListener('click', function (e) {
    const actionBtn = e.target.closest('.msg-action');
    if (!actionBtn) return;
    const msgEl = actionBtn.closest('.msg');
    const msg = chatState.messages.find(function (m) { return m.id === msgEl.dataset.id; });
    if (!msg) return;
    const action = actionBtn.dataset.action;

    if (action === 'copy') {
      copyText(msg.text);
    } else if (action === 'regenerate') {
      regenerate(msg);
    } else if (action === 'like') {
      msg.liked = !msg.liked;
      msg.disliked = false;
      renderMessages();
      if (msg.liked) showToast('Thanks for the feedback');
    } else if (action === 'dislike') {
      msg.disliked = !msg.disliked;
      msg.liked = false;
      renderMessages();
      if (msg.disliked) showToast('Thanks \u2014 noted');
    }
  });

  if (els.newConvoBtn) {
    els.newConvoBtn.addEventListener('click', function () {
      clearTimeout(chatState.pendingTimer);
      chatState.isGenerating = false;
      chatState.messages = [];
      updateSendButton();
      stopGenerating();
      renderMessages();
      els.textarea.value = '';
      autoResize(els.textarea);
      showToast('New conversation started');
    });
  }

  if (els.clearHistoryBtn) {
    els.clearHistoryBtn.addEventListener('click', function () {
      showToast('History cleared');
    });
  }

  if (els.settingsBtn) {
    els.settingsBtn.addEventListener('click', function () {
      showToast('Settings are coming in a future update');
    });
  }

  document.querySelectorAll('.tool-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showToast((btn.dataset.label || 'This tool') + ' is coming soon');
    });
  });
}

/* ---------- Init ---------- */
function init() {
  renderSuggestions();
  renderMessages();
  updateSendButton();
  bindEvents();
  initSidebarToggle();
}

init();
