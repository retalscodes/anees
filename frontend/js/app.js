// Navigation
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
      case 'home': initPrayer(); break;
      case 'dhikr': initDhikr(); break;
      case 'ask': initQA(); break;
      case 'quran': initQuran(); break;
      case 'more': initMorePage(); break;
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

  if (tab === 'qibla' && !initialized.qibla) { initialized.qibla = true; initQibla(); }
  if (tab === 'names' && !initialized.names) { initialized.names = true; initNames(); }
  if (tab === 'fasting' && !initialized.fasting) { initialized.fasting = true; initFasting(); }
  if (tab === 'settings' && !initialized.settings) { initialized.settings = true; initSettings(); }
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  navigate('home');
});
