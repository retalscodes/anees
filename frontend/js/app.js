// ─── i18n ───────────────────────────────────────────────────────
const I18N = {
  ar: {
    nav_home:        'الرئيسية',
    nav_dhikr:       'ذكر',
    nav_ask:         'اسأل',
    nav_quran:       'القرآن',
    nav_more:        'المزيد',
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
    nav_more:        'More',
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

// ─── Navigation ─────────────────────────────────────────────────
const PAGES = ['home', 'dhikr', 'ask', 'quran', 'more'];
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
      case 'home':  initPrayer(); break;
      case 'dhikr': initDhikr(); break;
      case 'ask':   initQA(); break;
      case 'quran': initQuran(); break;
      case 'more':  initMorePage(); break;
    }
  }
}

function initMorePage() {
  const moreTab = localStorage.getItem('moreTab') || 'qibla';
  switchMoreTab(moreTab);
}

function switchMoreTab(tab) {
  localStorage.setItem('moreTab', tab);
  document.querySelectorAll('[data-more-tab]').forEach(t => {
    t.classList.toggle('active', t.dataset.moreTab === tab);
  });
  ['qibla', 'names', 'fasting', 'settings'].forEach(t => {
    const el = document.getElementById(`more-${t}`);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });

  if (tab === 'qibla'    && !initialized.qibla)    { initialized.qibla    = true; initQibla(); }
  if (tab === 'names'    && !initialized.names)    { initialized.names    = true; initNames(); }
  if (tab === 'fasting'  && !initialized.fasting)  { initialized.fasting  = true; initFasting(); }
  if (tab === 'settings' && !initialized.settings) { initialized.settings = true; initSettings(); }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── Service Worker ──────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) { refreshing = true; window.location.reload(); }
  });
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// ─── Boot ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('anees_lang');
  if (savedLang) {
    setLang(savedLang);
    navigate('home');
  } else {
    document.getElementById('lang-modal').style.display = 'flex';
  }
});
