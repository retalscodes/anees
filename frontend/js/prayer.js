const PRAYER_NAMES = {
  Fajr: { ar: 'الفجر', en: 'Fajr' },
  Sunrise: { ar: 'الشروق', en: 'Sunrise' },
  Dhuhr: { ar: 'الظهر', en: 'Dhuhr' },
  Asr: { ar: 'العصر', en: 'Asr' },
  Maghrib: { ar: 'المغرب', en: 'Maghrib' },
  Isha: { ar: 'العشاء', en: 'Isha' },
};

const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

let prayerData = null;
let countdownInterval = null;

async function initPrayer() {
  try {
    const pos = await getPosition();
    const method = localStorage.getItem('prayerMethod') || '3';
    const resp = await fetch(`/api/prayer/times?lat=${pos.lat}&lng=${pos.lng}&method=${method}`);
    const data = await resp.json();
    prayerData = data.data.timings;
    renderPrayerTimes();
    startCountdown();
  } catch (e) {
    document.getElementById('next-prayer-name').textContent = 'تعذر التحميل';
    document.getElementById('next-prayer-time').textContent = '--:--';
  }

  loadHijriDate();
  loadDailyHadith();
}

async function getPosition() {
  const cached = localStorage.getItem('userLocation');
  if (cached) {
    const loc = JSON.parse(cached);
    if (Date.now() - loc.ts < 3600000) return loc;
  }

  // Try GPS first
  if (navigator.geolocation) {
    try {
      const loc = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, ts: Date.now() }),
          reject,
          { timeout: 8000 }
        );
      });
      localStorage.setItem('userLocation', JSON.stringify(loc));
      return loc;
    } catch (e) { /* fall through to IP */ }
  }

  // Fallback: IP-based location (no permission needed)
  const resp = await fetch('https://ipapi.co/json/');
  const data = await resp.json();
  const loc = { lat: data.latitude, lng: data.longitude, ts: Date.now() };
  localStorage.setItem('userLocation', JSON.stringify(loc));
  return loc;
}

function to12h(time24) {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function getNextPrayer(timings) {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  for (const name of PRAYER_ORDER) {
    if (name === 'Sunrise') continue;
    const [h, m] = timings[name].split(':').map(Number);
    const prayerMins = h * 60 + m;
    if (prayerMins > nowMins) return { name, time: timings[name], mins: prayerMins };
  }
  // Next is Fajr tomorrow
  const [h, m] = timings['Fajr'].split(':').map(Number);
  return { name: 'Fajr', time: timings['Fajr'], mins: h * 60 + m + 1440 };
}

function renderPrayerTimes() {
  const next = getNextPrayer(prayerData);
  document.getElementById('next-prayer-name').textContent = PRAYER_NAMES[next.name]?.ar || next.name;
  document.getElementById('next-prayer-time').textContent = to12h(next.time);

  const grid = document.getElementById('prayers-grid');
  grid.innerHTML = PRAYER_ORDER.map(name => `
    <div class="prayer-item ${name === next.name ? 'next-highlight' : ''}">
      <div class="p-name-ar">${PRAYER_NAMES[name]?.ar || name}</div>
      <div class="p-time">${to12h(prayerData[name])}</div>
    </div>
  `).join('');
}

function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 60000);
}

function updateCountdown() {
  if (!prayerData) return;
  const next = getNextPrayer(prayerData);
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  let diff = next.mins - nowMins;
  if (diff < 0) diff += 1440;
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  const el = document.getElementById('next-prayer-countdown');
  if (el) {
    el.textContent = hrs > 0
      ? `في ${hrs} ساعة و ${mins} دقيقة`
      : `في ${mins} دقيقة`;
  }
}

async function loadHijriDate() {
  try {
    const resp = await fetch('/api/prayer/hijri');
    const data = await resp.json();
    const h = data.data.hijri;
    const el = document.getElementById('hijri-date');
    if (el) el.textContent = `${h.day} ${h.month.ar} ${h.year}هـ`;
  } catch (e) { /* silent */ }
}

async function loadDailyHadith() {
  try {
    const resp = await fetch('/api/hadith/random');
    const h = await resp.json();
    const el = document.getElementById('daily-hadith');
    if (!el) return;
    el.innerHTML = `
      <div class="hadith-text">${h.text}</div>
      <div class="hadith-translation">${h.translation}</div>
      <div class="flex-between">
        <span class="source-tag">${h.source}</span>
        <span class="muted">${h.narrator}</span>
      </div>
    `;
  } catch (e) { /* silent */ }
}
