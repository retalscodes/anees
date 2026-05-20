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
  loadHijriDate();
  loadDailyHadith();

  try {
    const pos = await getPosition();
    await loadPrayerForPos(pos);
  } catch (e) {
    showCityInput();
  }
}

async function loadPrayerForPos(pos) {
  const method = localStorage.getItem('prayerMethod') || '3';
  const resp = await fetch(`/api/prayer/times?lat=${pos.lat}&lng=${pos.lng}&method=${method}`);
  const data = await resp.json();
  if (!resp.ok || !data.data?.timings) throw new Error('تعذر تحميل مواقيت الصلاة. حاول مرة أخرى.');
  prayerData = data.data.timings;
  renderPrayerTimes();
  startCountdown();
}

async function getPosition() {
  // Return cached if fresh (1 hour)
  const cached = localStorage.getItem('userLocation');
  if (cached) {
    const loc = JSON.parse(cached);
    if (loc.lat && loc.lng && Date.now() - loc.ts < 3600000) return loc;
  }

  // 1. GPS
  if (navigator.geolocation) {
    try {
      const loc = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(
          p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, ts: Date.now() }),
          reject,
          { timeout: 7000 }
        )
      );
      localStorage.setItem('userLocation', JSON.stringify(loc));
      return loc;
    } catch (e) { /* try IP */ }
  }

  // 2. Multiple IP geolocation fallbacks
  const services = [
    async () => { const d = await (await fetch('https://ipwho.is/')).json(); return { lat: d.latitude, lng: d.longitude }; },
    async () => { const d = await (await fetch('https://ipapi.co/json/')).json(); return { lat: d.latitude, lng: d.longitude }; },
    async () => { const d = await (await fetch('https://ip-api.com/json')).json(); return { lat: d.lat, lng: d.lon }; },
  ];

  for (const fn of services) {
    try {
      const { lat, lng } = await fn();
      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        const loc = { lat, lng, ts: Date.now() };
        localStorage.setItem('userLocation', JSON.stringify(loc));
        return loc;
      }
    } catch (e) { /* next service */ }
  }

  throw new Error('Location unavailable');
}

function showCityInput() {
  const card = document.getElementById('next-prayer-card');
  if (!card) return;
  card.innerHTML = `
    <div style="padding:8px 4px">
      <div style="color:rgba(255,255,255,0.65);font-size:13px;margin-bottom:12px;text-align:center">
        أدخل مدينتك لعرض مواقيت الصلاة
      </div>
      <input id="city-input" type="text" placeholder="e.g. Amman, Riyadh, Cairo, London..."
        style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:10px;
               color:#fff;padding:11px 14px;width:100%;font-size:15px;
               outline:none;font-family:'Inter',sans-serif;margin-bottom:10px;direction:ltr"
        onkeydown="if(event.key==='Enter')searchCity()"/>
      <button onclick="searchCity()"
        style="background:rgba(110,196,180,0.25);border:1px solid rgba(110,196,180,0.45);
               color:#6ec4b4;padding:10px;border-radius:10px;font-size:14px;
               cursor:pointer;width:100%;font-family:'Amiri',serif">
        بحث 🔍
      </button>
      <div id="city-error" style="color:#e05555;font-size:12px;margin-top:8px;text-align:center"></div>
    </div>
  `;
}

async function searchCity() {
  const input = document.getElementById('city-input');
  const errEl = document.getElementById('city-error');
  const city = input?.value?.trim();
  if (!city) return;

  input.disabled = true;
  if (errEl) errEl.textContent = '';

  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'ar,en' } }
    );
    const data = await resp.json();
    if (!data[0]) throw new Error('لم يتم العثور على المدينة');

    const loc = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), ts: Date.now() };
    localStorage.setItem('userLocation', JSON.stringify(loc));
    await loadPrayerForPos(loc);
  } catch (e) {
    if (errEl) errEl.textContent = e.message || 'خطأ في البحث، حاول مرة أخرى';
    if (input) input.disabled = false;
  }
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

  // Show detected location with a change button
  let locBar = document.getElementById('prayer-location');
  if (!locBar) {
    locBar = document.createElement('div');
    locBar.id = 'prayer-location';
    grid.insertAdjacentElement('afterend', locBar);
  }
  const cached = localStorage.getItem('userLocation');
  if (cached) {
    const { lat, lng } = JSON.parse(cached);
    fetchCityName(lat, lng).then(name => {
      if (name && locBar) {
        locBar.innerHTML = `<span>📍 ${name}</span><button onclick="changeLocation()">تغيير الموقع</button>`;
      }
    });
  }
}

async function fetchCityName(lat, lng) {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
      { headers: { 'Accept-Language': 'ar' } }
    );
    const d = await r.json();
    return d.address?.city || d.address?.town || d.address?.county || null;
  } catch { return null; }
}

function changeLocation() {
  localStorage.removeItem('userLocation');
  showCityInput();
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
  if (el) el.textContent = hrs > 0 ? `في ${hrs} ساعة و ${mins} دقيقة` : `في ${mins} دقيقة`;
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
