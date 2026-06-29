// ─── i18n ───────────────────────────────────────────────────────
const I18N = {
  ar: {
    nav_home:        'الرئيسية',
    nav_dhikr:       'ذكر',
    nav_ask:         'اسأل',
    nav_quran:       'القرآن',
    nav_profile:     'ملفي',
    next_prayer:     'الصلاة القادمة',
    daily_hadith:    'حديث اليوم',
    ayah_today:      'آية اليوم',
    quran_label:     'القرآن الكريم',
    qa_empty_title:  'اسأل أنيس',
    qa_empty_sub:    'اسألني أي سؤال في الفقه والعبادات والسيرة',
    ask_placeholder: 'اسأل سؤالك بالعربي أو الإنجليزي...',
    settings_lang:   'اللغة',
    settings_lang_btn: 'تغيير',
    loading:         'جاري التحميل...',
  },
  en: {
    nav_home:        'Home',
    nav_dhikr:       'Dhikr',
    nav_ask:         'Ask',
    nav_quran:       'Quran',
    nav_profile:     'Profile',
    next_prayer:     'Next Prayer',
    daily_hadith:    'Hadith of the Day',
    ayah_today:      'Verse of the Day',
    quran_label:     'The Holy Quran',
    qa_empty_title:  'Ask Anees',
    qa_empty_sub:    'Ask me about fiqh, worship, or seerah',
    ask_placeholder: 'Ask in Arabic or English...',
    settings_lang:   'Language',
    settings_lang_btn: 'Change',
    loading:         'Loading...',
  }
};

let currentLang = 'ar';

function t(key) {
  return I18N[currentLang]?.[key] ?? I18N.ar[key] ?? key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('anees_lang', lang);
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'en' ? 'ltr' : 'rtl';
  applyTranslations();
  const modal = document.getElementById('lang-modal');
  if (modal) modal.style.display = 'none';
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  const qInput = document.getElementById('qa-input');
  if (qInput) qInput.placeholder = t('ask_placeholder');
  const disc = document.getElementById('qa-disclaimer');
  if (disc) {
    if (currentLang === 'en') {
      disc.innerHTML = '🔒 Anees answers from trusted sources: <strong>islamqa.info</strong> &amp; <strong>islamweb.net</strong><br/>For personal matters, consult a qualified scholar';
    } else {
      disc.innerHTML = '🔒 أنيس يجيب من مصادر موثوقة: <strong>islamqa.info</strong> و <strong>islamweb.net</strong><br/>للأمور الشخصية، استشر عالمًا مؤهلًا';
    }
  }
}

// ─── Theme ──────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('anees_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('anees_theme', theme);
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.innerHTML = theme === 'dark'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    btn.title = theme === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن';
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'dark' ? '#08090e' : '#f8f5ef';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ─── Offline / Online banner ────────────────────────────────────────
function updateOnlineStatus() {
  const bar = document.getElementById('offline-bar');
  if (!bar) return;
  if (navigator.onLine) {
    bar.classList.remove('visible');
  } else {
    bar.classList.add('visible');
  }
}

// ─── Mood Recommender ───────────────────────────────────────────────
const MOOD_CARDS = [
  { emoji: '😔', label: 'حزين؟',              labelEn: 'Feeling down?',       surah: 'الضحى',    page: 596, note: 'الله لم يودّعك ولم يقلاك' },
  { emoji: '😰', label: 'قلق أو خائف؟',       labelEn: 'Feeling anxious?',    surah: 'الشرح',    page: 596, note: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا' },
  { emoji: '😴', label: 'وقت النوم؟',          labelEn: 'At bedtime?',         surah: 'الملك',    page: 562, note: 'اقرأها كل ليلة' },
  { emoji: '🛡️', label: 'تحتاج حماية؟',       labelEn: 'Seeking protection?', surah: 'البقرة',   page: 2,   note: 'آية الكرسي وخواتيم البقرة' },
  { emoji: '💔', label: 'تشعر بالوحدة؟',      labelEn: 'Feeling alone?',      surah: 'الإنشراح', page: 596, note: 'لست وحدك أبدًا' },
  { emoji: '🌙', label: 'تريد القرب من الله؟', labelEn: 'Seeking closeness?',  surah: 'الرحمن',   page: 531, note: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ' },
  { emoji: '😤', label: 'غاضب؟',              labelEn: 'Feeling angry?',      surah: 'يوسف',     page: 235, note: 'قصة الصبر والعفو' },
  { emoji: '🤔', label: 'تبحث عن وضوح؟',     labelEn: 'Need clarity?',       surah: 'الكهف',    page: 293, note: 'نور في كل يوم جمعة' },
  { emoji: '⚡', label: 'أمر مهم قادم؟',     labelEn: 'Big moment ahead?',   surah: 'طه',       page: 312, note: 'رَبِّ اشْرَحْ لِي صَدْرِي' },
  { emoji: '🌸', label: 'امتنان؟',            labelEn: 'Feeling grateful?',   surah: 'إبراهيم',  page: 255, note: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ' },
];

function renderMoodRecommender() {
  const wrap = document.getElementById('mood-strip');
  if (!wrap) return;
  wrap.innerHTML = MOOD_CARDS.map((c, i) => `
    <button class="mood-card" onclick="openMoodSurah(${i})" type="button">
      <div class="mood-emoji">${c.emoji}</div>
      <div class="mood-label">${currentLang === 'en' ? c.labelEn : c.label}</div>
      <div class="mood-surah">${c.surah}</div>
      <div class="mood-note">${c.note}</div>
    </button>
  `).join('');
}

function openMoodSurah(idx) {
  const card = MOOD_CARDS[idx];
  navigate('quran');
  // Give the quran page a tick to initialise before jumping
  setTimeout(() => {
    if (typeof goToMushafPage === 'function') goToMushafPage(card.page);
    const viewer = document.getElementById('mushaf-viewer');
    if (viewer) viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

// ─── PWA Install Prompt ─────────────────────────────────────────────
let _deferredInstallPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  _deferredInstallPrompt = e;
  // Show install banner after user has been active for 90 seconds and hasn't dismissed it
  if (!localStorage.getItem('anees_install_dismissed')) {
    setTimeout(showInstallBanner, 90_000);
  }
});

window.addEventListener('appinstalled', () => {
  hideInstallBanner();
  _deferredInstallPrompt = null;
  localStorage.setItem('anees_install_dismissed', '1');
});

function showInstallBanner() {
  if (localStorage.getItem('anees_install_dismissed')) return;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
  if (isStandalone) return;

  const banner = document.getElementById('install-banner');
  if (!banner) return;
  const iosHint = document.getElementById('install-ios-hint');
  const androidBtn = document.getElementById('install-android-btn');
  if (isIOS) {
    if (iosHint) iosHint.style.display = 'block';
    if (androidBtn) androidBtn.style.display = 'none';
  } else {
    if (iosHint) iosHint.style.display = 'none';
    if (androidBtn) androidBtn.style.display = 'inline-flex';
  }
  banner.classList.add('visible');
}

function hideInstallBanner() {
  const banner = document.getElementById('install-banner');
  if (banner) banner.classList.remove('visible');
  localStorage.setItem('anees_install_dismissed', '1');
}

async function triggerInstallPrompt() {
  if (!_deferredInstallPrompt) return;
  _deferredInstallPrompt.prompt();
  const { outcome } = await _deferredInstallPrompt.userChoice;
  _deferredInstallPrompt = null;
  if (outcome === 'accepted') hideInstallBanner();
}

// ─── Navigation ─────────────────────────────────────────────────────
const PAGES = ['home', 'dhikr', 'ask', 'quran', 'profile', 'stories'];
let currentPage = 'home';
let initialized = {};

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  document.getElementById(`page-${page}`).classList.add('active');
  document.querySelector(`[data-nav="${page}"]`).classList.add('active');
  currentPage = page;

  if (!initialized[page]) {
    initialized[page] = true;
    switch (page) {
      case 'home':    initPrayer(); renderMoodRecommender(); break;
      case 'dhikr':   initDhikr(); break;
      case 'ask':     initQA(); break;
      case 'quran':   initQuran(); break;
      case 'profile': initProfile(); break;
      case 'stories': initStories(); break;
    }
  }

  // Smart notification prompt on first visit to home or dhikr
  if ((page === 'home' || page === 'dhikr') &&
      'Notification' in window &&
      Notification.permission === 'default' &&
      !localStorage.getItem('anees_notif_prompted')) {
    setTimeout(() => showNotifPrompt(), 1200);
  }
}

// ─── Notification prompt ────────────────────────────────────────────
function showNotifPrompt() {
  const banner = document.getElementById('notif-prompt');
  if (banner) banner.style.display = 'block';
}

function dismissNotifPrompt() {
  const banner = document.getElementById('notif-prompt');
  if (banner) banner.style.display = 'none';
  localStorage.setItem('anees_notif_prompted', '1');
}

async function enableNotifFromPrompt() {
  dismissNotifPrompt();
  if (!('Notification' in window)) return;
  const perm = await Notification.requestPermission();
  if (perm === 'granted') showToast('تم تفعيل الإشعارات ✓');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── Rate-limit error handling for QA ───────────────────────────────
function handleQARateLimit(detail) {
  const msg = typeof detail === 'object'
    ? (currentLang === 'ar' ? detail.ar : detail.en)
    : detail;
  return msg || 'تجاوزت حد الأسئلة المسموح بها. حاول لاحقًا.';
}

// ─── Service Worker ──────────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) { refreshing = true; window.location.reload(); }
  });
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// ─── Boot ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  if (typeof initKidsMode === 'function') initKidsMode();

  // Offline/online status
  window.addEventListener('online',  updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  // Close modals on overlay tap
  ['edit-name-modal', 'mushaf-goto-modal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', e => { if (e.target === el) el.style.display = 'none'; });
  });

  // Edit name input — Enter to save
  const nameInput = document.getElementById('edit-name-input');
  if (nameInput) nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveProfileName(); });

  // Mushaf goto — Enter to jump
  const gotoInput = document.getElementById('mushaf-goto-input');
  if (gotoInput) gotoInput.addEventListener('keydown', e => { if (e.key === 'Enter') confirmMushafGoto(); });

  const savedLang = localStorage.getItem('anees_lang');
  if (savedLang) {
    setLang(savedLang);
    navigate('home');
  } else {
    document.getElementById('lang-modal').style.display = 'flex';
  }
});
