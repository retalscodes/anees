// ─── QIBLA ───────────────────────────────────────────────
const MECCA = { lat: 21.4225, lng: 39.8262 };
let qiblaAngle = null;
let compassHeading = 0;
let qiblaCanvas, qiblaCtx;

function initQibla() {
  qiblaCanvas = document.getElementById('qibla-canvas');
  qiblaCtx = qiblaCanvas.getContext('2d');
  qiblaCanvas.width = 440;
  qiblaCanvas.height = 440;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      qiblaAngle = calculateQibla(latitude, longitude);
      document.getElementById('qibla-degree').textContent = Math.round(qiblaAngle) + '°';
      document.getElementById('qibla-status').textContent = 'اتجاه القبلة من موقعك';
      startCompass();
    },
    () => {
      document.getElementById('qibla-status').textContent = 'يرجى السماح بالوصول للموقع';
      drawCompass(0, 0);
    }
  );
}

function calculateQibla(lat, lng) {
  const mLat = MECCA.lat * Math.PI / 180;
  const mLng = MECCA.lng * Math.PI / 180;
  const uLat = lat * Math.PI / 180;
  const uLng = lng * Math.PI / 180;
  const dLng = mLng - uLng;
  const y = Math.sin(dLng) * Math.cos(mLat);
  const x = Math.cos(uLat) * Math.sin(mLat) - Math.sin(uLat) * Math.cos(mLat) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
}

function startCompass() {
  if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) {
    DeviceOrientationEvent.requestPermission().then(perm => {
      if (perm === 'granted') listenCompass();
    });
  } else if (window.DeviceOrientationEvent) {
    listenCompass();
  } else {
    drawCompass(0, qiblaAngle);
  }
}

function listenCompass() {
  window.addEventListener('deviceorientationabsolute', (e) => {
    compassHeading = e.alpha || 0;
    drawCompass(compassHeading, qiblaAngle);
  }, true);

  window.addEventListener('deviceorientation', (e) => {
    if (e.webkitCompassHeading) {
      compassHeading = e.webkitCompassHeading;
    } else if (e.alpha !== null) {
      compassHeading = 360 - e.alpha;
    }
    drawCompass(compassHeading, qiblaAngle);
  }, true);
}

function drawCompass(heading, qibla) {
  const canvas = qiblaCanvas;
  const ctx = qiblaCtx;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = 190;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#1e3828';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Tick marks
  for (let i = 0; i < 360; i += 10) {
    const angle = (i - heading) * Math.PI / 180;
    const inner = i % 90 === 0 ? r - 20 : i % 30 === 0 ? r - 14 : r - 8;
    ctx.beginPath();
    ctx.moveTo(cx + inner * Math.sin(angle), cy - inner * Math.cos(angle));
    ctx.lineTo(cx + r * Math.sin(angle), cy - r * Math.cos(angle));
    ctx.strokeStyle = i % 90 === 0 ? '#2d8a5e' : '#1e3828';
    ctx.lineWidth = i % 90 === 0 ? 2 : 1;
    ctx.stroke();
  }

  // Cardinal directions
  const cards = [['N', 0], ['E', 90], ['S', 180], ['W', 270]];
  ctx.font = '600 18px Inter';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  cards.forEach(([label, deg]) => {
    const angle = (deg - heading) * Math.PI / 180;
    const dist = r - 32;
    ctx.fillStyle = label === 'N' ? '#e05555' : '#4a7a5e';
    ctx.fillText(label, cx + dist * Math.sin(angle), cy - dist * Math.cos(angle));
  });

  // Qibla needle
  if (qibla !== null) {
    const qAngle = (qibla - heading) * Math.PI / 180;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(qAngle);

    // Needle
    ctx.beginPath();
    ctx.moveTo(0, -(r - 10));
    ctx.lineTo(8, 20);
    ctx.lineTo(-8, 20);
    ctx.closePath();
    ctx.fillStyle = '#c9a84c';
    ctx.fill();

    // Kaaba icon text
    ctx.font = '22px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🕋', 0, -(r - 22));
    ctx.restore();
  }

  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#1e7a4a';
  ctx.fill();
}

// ─── 99 NAMES ────────────────────────────────────────────
function initNames() {
  const search = document.getElementById('names-search');
  search.addEventListener('input', () => renderNames(search.value.toLowerCase()));
  renderNames('');
}

function renderNames(filter = '') {
  const container = document.getElementById('names-grid');
  const filtered = NAMES_OF_ALLAH.filter(n =>
    !filter ||
    n.arabic.includes(filter) ||
    n.transliteration.toLowerCase().includes(filter) ||
    n.meaning.toLowerCase().includes(filter)
  );

  container.innerHTML = filtered.map(n => `
    <div class="name-card" onclick="showNameDetail(${n.number - 1})">
      <div class="name-number">${n.number}</div>
      <div class="name-arabic">${n.arabic}</div>
      <div class="name-meaning">${n.meaning}</div>
    </div>
  `).join('');
}

function showNameDetail(idx) {
  const n = NAMES_OF_ALLAH[idx];
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-sheet">
      <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">إغلاق</button>
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:11px;color:var(--text-dim);margin-bottom:4px">${n.number} / 99</div>
        <div style="font-family:'Amiri',serif;font-size:40px;color:var(--gold)">${n.arabic}</div>
        <div style="font-size:16px;color:var(--text-muted);margin-top:4px">${n.transliteration}</div>
      </div>
      <div style="font-size:18px;font-weight:600;color:var(--text);margin-bottom:8px">${n.meaning}</div>
      <div style="font-size:14px;color:var(--text-muted);line-height:1.7">${n.description}</div>
    </div>
  `;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// ─── FASTING ─────────────────────────────────────────────
let fastingData = { fasting: false, startTime: null, log: [] };
let fastTimerInterval = null;

function initFasting() {
  const saved = localStorage.getItem('fastingData');
  if (saved) fastingData = JSON.parse(saved);
  renderFasting();
}

function toggleFast() {
  const today = new Date().toDateString();
  if (fastingData.fasting) {
    const duration = Date.now() - fastingData.startTime;
    fastingData.log = fastingData.log || [];
    fastingData.log.unshift({ date: today, duration, completed: true });
    fastingData.log = fastingData.log.slice(0, 30);
    fastingData.fasting = false;
    fastingData.startTime = null;
    showToast('بارك الله في صيامك 🤲');
  } else {
    fastingData.fasting = true;
    fastingData.startTime = Date.now();
    showToast('نية الصيام مسجلة');
  }
  localStorage.setItem('fastingData', JSON.stringify(fastingData));
  renderFasting();
}

function renderFasting() {
  const btn = document.getElementById('fast-toggle-btn');
  const timer = document.getElementById('fast-timer');

  if (btn) {
    btn.textContent = fastingData.fasting ? 'أفطرت — انقر للتسجيل' : 'نويت الصيام — انقر للتسجيل';
    btn.className = 'fast-btn' + (fastingData.fasting ? ' active' : '');
  }

  if (fastTimerInterval) clearInterval(fastTimerInterval);

  if (fastingData.fasting && fastingData.startTime && timer) {
    const update = () => {
      const elapsed = Date.now() - fastingData.startTime;
      const h = Math.floor(elapsed / 3600000);
      const m = Math.floor((elapsed % 3600000) / 60000);
      timer.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    };
    update();
    fastTimerInterval = setInterval(update, 60000);
  } else if (timer) {
    timer.textContent = '--:--';
  }

  const log = document.getElementById('fast-log');
  if (log && fastingData.log && fastingData.log.length > 0) {
    log.innerHTML = fastingData.log.slice(0, 7).map(entry => {
      const d = new Date(entry.date);
      const label = d.toLocaleDateString('ar-JO', { weekday: 'short', day: 'numeric', month: 'short' });
      const h = Math.floor(entry.duration / 3600000);
      const m = Math.floor((entry.duration % 3600000) / 60000);
      return `<div class="flex-between" style="padding:10px 0;border-bottom:1px solid var(--border)">
        <span class="muted">${label}</span>
        <span style="color:var(--gold)">${h}س ${m}د ✓</span>
      </div>`;
    }).join('');
  }
}

// ─── SETTINGS ────────────────────────────────────────────
function initSettings() {
  const methodSelect = document.getElementById('prayer-method-select');
  if (methodSelect) {
    methodSelect.value = localStorage.getItem('prayerMethod') || '3';
    methodSelect.addEventListener('change', () => {
      localStorage.setItem('prayerMethod', methodSelect.value);
      localStorage.removeItem('userLocation');
      showToast('سيتم تحديث مواقيت الصلاة');
      initPrayer();
    });
  }

  const notifBtn = document.getElementById('notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', requestNotifications);
    notifBtn.textContent = Notification.permission === 'granted' ? 'مفعّلة ✓' : 'تفعيل الإشعارات';
  }
}

async function requestNotifications() {
  if (!('Notification' in window)) return showToast('المتصفح لا يدعم الإشعارات');
  const perm = await Notification.requestPermission();
  const btn = document.getElementById('notif-btn');
  if (perm === 'granted') {
    if (btn) btn.textContent = 'مفعّلة ✓';
    showToast('تم تفعيل الإشعارات');
  }
}
