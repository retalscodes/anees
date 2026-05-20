const PRAYER_NAMES = {
  Fajr:    { ar: 'الفجر',   en: 'Fajr'    },
  Sunrise: { ar: 'الشروق',  en: 'Sunrise' },
  Dhuhr:   { ar: 'الظهر',   en: 'Dhuhr'   },
  Asr:     { ar: 'العصر',   en: 'Asr'     },
  Maghrib: { ar: 'المغرب',  en: 'Maghrib' },
  Isha:    { ar: 'العشاء',  en: 'Isha'    },
};
const PRAYER_ORDER = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

let prayerData = null;
let countdownInterval = null;

async function initPrayer() {
  loadHijriDate();
  loadDailyHadith();

  // 1. Saved city → most reliable, use it directly
  const savedCity = localStorage.getItem('prayerCity');
  if (savedCity) {
    try {
      const { city, country } = JSON.parse(savedCity);
      await loadPrayerForCity(city, country || '');
      return;
    } catch { /* saved city failed, fall through */ }
  }

  // 2. GPS → accurate but permission-gated
  try {
    const pos = await getGPSPosition();
    await loadPrayerForCoords(pos.lat, pos.lng);
    // Reverse-geocode to show city name
    fetchCityName(pos.lat, pos.lng).then(name => {
      if (name) showLocationBar(name);
    });
    return;
  } catch { /* GPS unavailable or denied */ }

  // 3. Nothing worked → ask for city
  showCityInput();
}

// ─── Location helpers ───────────────────────────────────────────

function getGPSPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) { reject(new Error('no gps')); return; }
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      reject,
      { timeout: 6000 }
    );
  });
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

// ─── Prayer time loaders ────────────────────────────────────────

async function loadPrayerForCity(city, country) {
  const method = localStorage.getItem('prayerMethod') || '3';
  const q = `city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;
  const resp = await fetch(`/api/prayer/times-by-city?${q}`);
  const data = await resp.json();
  if (!resp.ok || !data.data?.timings) {
    throw new Error(data.detail || 'لم يتم العثور على المدينة');
  }
  prayerData = data.data.timings;
  const displayName = country ? `${city}, ${country}` : city;
  renderPrayerTimes(displayName);
  startCountdown();
}

async function loadPrayerForCoords(lat, lng) {
  const method = localStorage.getItem('prayerMethod') || '3';
  const resp = await fetch(`/api/prayer/times?lat=${lat}&lng=${lng}&method=${method}`);
  const data = await resp.json();
  if (!resp.ok || !data.data?.timings) {
    throw new Error('تعذر تحميل مواقيت الصلاة');
  }
  prayerData = data.data.timings;
  renderPrayerTimes(null);
  startCountdown();
}

// ─── City input UI ──────────────────────────────────────────────

function showCityInput(errorMsg) {
  const card = document.getElementById('next-prayer-card');
  if (!card) return;
  card.innerHTML = `
    <div style="padding:8px 4px">
      <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-bottom:14px;text-align:center">
        أدخل مدينتك لعرض مواقيت الصلاة
      </div>
      <input id="city-input" type="text" placeholder="e.g. Amman, Riyadh, Cairo, London..."
        style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:10px;
               color:#fff;padding:11px 14px;width:100%;font-size:15px;outline:none;
               font-family:'Inter',sans-serif;margin-bottom:8px;direction:ltr"
        onkeydown="if(event.key==='Enter')searchCity()"/>
      <input id="country-input" type="text" placeholder="Country (optional, e.g. Jordan)"
        style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.15);border-radius:10px;
               color:#fff;padding:9px 14px;width:100%;font-size:13px;outline:none;
               font-family:'Inter',sans-serif;margin-bottom:10px;direction:ltr"
        onkeydown="if(event.key==='Enter')searchCity()"/>
      <button onclick="searchCity()"
        style="background:rgba(110,196,180,0.25);border:1px solid rgba(110,196,180,0.45);
               color:#6ec4b4;padding:10px;border-radius:10px;font-size:14px;
               cursor:pointer;width:100%;font-family:'Amiri',serif">
        بحث 🔍
      </button>
      <div id="city-error" style="color:#e05555;font-size:12px;margin-top:8px;text-align:center">
        ${errorMsg || ''}
      </div>
    </div>
  `;
  setTimeout(() => document.getElementById('city-input')?.focus(), 100);
}

async function searchCity() {
  const cityEl = document.getElementById('city-input');
  const countryEl = document.getElementById('country-input');
  const errEl = document.getElementById('city-error');
  const city = cityEl?.value?.trim();
  const country = countryEl?.value?.trim() || '';
  if (!city) return;

  if (cityEl) cityEl.disabled = true;
  if (countryEl) countryEl.disabled = true;
  if (errEl) errEl.textContent = 'جاري البحث...';

  try {
    await loadPrayerForCity(city, country);
    localStorage.setItem('prayerCity', JSON.stringify({ city, country, ts: Date.now() }));
    localStorage.removeItem('userLocation');
  } catch (e) {
    if (errEl) errEl.textContent = e.message || 'لم يتم العثور على المدينة. تأكد من الاسم وأضف الدولة.';
    if (cityEl) cityEl.disabled = false;
    if (countryEl) countryEl.disabled = false;
  }
}

function changeLocation() {
  localStorage.removeItem('prayerCity');
  localStorage.removeItem('userLocation');
  showCityInput();
}

// ─── Rendering ──────────────────────────────────────────────────

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
    if (h * 60 + m > nowMins) return { name, time: timings[name], mins: h * 60 + m };
  }
  const [h, m] = timings['Fajr'].split(':').map(Number);
  return { name: 'Fajr', time: timings['Fajr'], mins: h * 60 + m + 1440 };
}

function renderPrayerTimes(cityName) {
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

  if (cityName) showLocationBar(cityName);
}

function showLocationBar(name) {
  let bar = document.getElementById('prayer-location');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'prayer-location';
    document.getElementById('prayers-grid').insertAdjacentElement('afterend', bar);
  }
  bar.innerHTML = `<span>📍 ${name}</span><button onclick="changeLocation()">تغيير الموقع</button>`;
}

function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval);
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 60000);
}

function updateCountdown() {
  if (!prayerData) return;
  const next = getNextPrayer(prayerData);
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
  let diff = next.mins - nowMins;
  if (diff < 0) diff += 1440;
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  const el = document.getElementById('next-prayer-countdown');
  if (el) el.textContent = hrs > 0 ? `في ${hrs} ساعة و ${mins} دقيقة` : `في ${mins} دقيقة`;
}

// ─── Hijri date & hadith ────────────────────────────────────────

async function loadHijriDate() {
  try {
    const resp = await fetch('/api/prayer/hijri');
    const data = await resp.json();
    const h = data.data.hijri;
    const el = document.getElementById('hijri-date');
    if (el) el.textContent = `${h.day} ${h.month.ar} ${h.year}هـ`;
  } catch { /* silent */ }
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
  } catch { /* silent */ }
}
