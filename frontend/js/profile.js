// ─── PROFILE, CALENDAR & BOOKMARKS ─────────────────────────────────

const HIJRI_MONTHS_AR = [
  'محرم','صفر','ربيع الأول','ربيع الثاني',
  'جمادى الأولى','جمادى الآخرة','رجب','شعبان',
  'رمضان','شوال','ذو القعدة','ذو الحجة'
];
const DAYS_OF_WEEK_AR = ['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'];

const ISLAMIC_EVENTS = [
  { month:1,  day:1,  name:'رأس السنة الهجرية' },
  { month:1,  day:10, name:'عاشوراء' },
  { month:3,  day:12, name:'المولد النبوي الشريف' },
  { month:7,  day:27, name:'الإسراء والمعراج' },
  { month:8,  day:15, name:'منتصف شعبان' },
  { month:9,  day:1,  name:'أول رمضان المبارك' },
  { month:9,  day:27, name:'ليلة القدر (المرتقبة)' },
  { month:10, day:1,  name:'عيد الفطر المبارك 🌙' },
  { month:12, day:9,  name:'يوم عرفة' },
  { month:12, day:10, name:'عيد الأضحى المبارك 🐑' },
];

let calState = null; // { year, month }
let calTodayH = null;
let toolsInitDone = {};

// ─── Intl-based Hijri helpers ────────────────────────────────────────

function getHijriFromDate(date) {
  try {
    const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'numeric', year: 'numeric'
    });
    const parts = fmt.formatToParts(date);
    return {
      day:   parseInt(parts.find(p => p.type === 'day').value),
      month: parseInt(parts.find(p => p.type === 'month').value),
      year:  parseInt(parts.find(p => p.type === 'year').value)
    };
  } catch { return null; }
}

function getFirstGregOfHijriMonth(hYear, hMonth) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const todayH = getHijriFromDate(today);
  if (!todayH) return today;

  // approximate offset
  const todayAbsM  = todayH.year * 12 + (todayH.month - 1);
  const targetAbsM = hYear * 12 + (hMonth - 1);
  const monthDiff  = targetAbsM - todayAbsM;

  // today's first of month
  const todayFirst = new Date(today.getTime() - (todayH.day - 1) * 86400000);

  // estimated first of target month
  let est = new Date(todayFirst.getTime() + monthDiff * 29.53 * 86400000);

  // fine-tune: scan ±4 days
  const scan = new Date(est.getTime() - 4 * 86400000);
  for (let i = 0; i < 10; i++) {
    const h = getHijriFromDate(scan);
    if (h && h.year === hYear && h.month === hMonth && h.day === 1) return new Date(scan);
    scan.setDate(scan.getDate() + 1);
  }
  return est;
}

function getHijriMonthLength(hYear, hMonth) {
  const firstGreg = getFirstGregOfHijriMonth(hYear, hMonth);
  for (let offset = 28; offset <= 31; offset++) {
    const test = new Date(firstGreg.getTime() + offset * 86400000);
    const h = getHijriFromDate(test);
    if (h && (h.month !== hMonth || h.year !== hYear)) return offset;
  }
  return 30;
}

// ─── PROFILE PAGE ────────────────────────────────────────────────────

function initProfile() {
  renderProfileCard();
  const saved = localStorage.getItem('profileTab') || 'calendar';
  switchProfileTab(saved);
}

function switchProfileTab(tab) {
  localStorage.setItem('profileTab', tab);
  document.querySelectorAll('[data-profile-tab]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.profileTab === tab);
  });
  ['calendar', 'bookmarks', 'tools', 'settings'].forEach(t => {
    const el = document.getElementById(`profile-${t}`);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  if (tab === 'calendar') initCalendar();
  if (tab === 'bookmarks') renderBookmarks();
  if (tab === 'tools') initToolsTab();
  if (tab === 'settings') initSettings();
}

function renderProfileCard() {
  const name = localStorage.getItem('anees_display_name') || '';
  const wirdData = JSON.parse(localStorage.getItem('wirdData') || '{}');
  const streak = wirdData.streak || 0;
  const memoCount = JSON.parse(localStorage.getItem('anees_memorized_pages') || '[]').length;
  const bmCount = JSON.parse(localStorage.getItem('anees_bookmarks') || '[]').length;

  const card = document.getElementById('profile-card');
  if (!card) return;
  card.innerHTML = `
    <div class="profile-top">
      <div class="profile-avatar">
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="var(--primary-light)" stroke-width="1.5" stroke-linecap="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <div class="profile-info">
        <div class="profile-name-row" onclick="openEditName()">
          <span class="profile-name-text">${name || 'اضغط لإضافة اسمك'}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.45">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/>
          </svg>
        </div>
        <div class="profile-stats-row">
          <div class="profile-stat-pill">🔥 <strong>${streak}</strong> يوم</div>
          <div class="profile-stat-pill">📖 <strong>${memoCount}</strong> ص محفوظة</div>
          <div class="profile-stat-pill">🔖 <strong>${bmCount}</strong> محفوظات</div>
        </div>
      </div>
    </div>
  `;
}

function openEditName() {
  const modal = document.getElementById('edit-name-modal');
  if (!modal) return;
  const input = document.getElementById('edit-name-input');
  if (input) input.value = localStorage.getItem('anees_display_name') || '';
  modal.style.display = 'flex';
  setTimeout(() => input && input.focus(), 150);
}

function saveProfileName() {
  const val = (document.getElementById('edit-name-input')?.value || '').trim();
  localStorage.setItem('anees_display_name', val);
  document.getElementById('edit-name-modal').style.display = 'none';
  renderProfileCard();
}

// ─── HIJRI CALENDAR ──────────────────────────────────────────────────

function initCalendar() {
  if (!calTodayH) calTodayH = getHijriFromDate(new Date());
  if (!calState)  calState  = { year: calTodayH.year, month: calTodayH.month };
  renderCalendar();
}

function calPrevMonth() {
  calState.month--;
  if (calState.month < 1) { calState.month = 12; calState.year--; }
  renderCalendar();
}

function calNextMonth() {
  calState.month++;
  if (calState.month > 12) { calState.month = 1; calState.year++; }
  renderCalendar();
}

function renderCalendar() {
  const container = document.getElementById('hijri-calendar');
  if (!container) return;

  const { year, month } = calState;
  const monthName  = HIJRI_MONTHS_AR[month - 1];
  const monthLen   = getHijriMonthLength(year, month);
  const firstGreg  = getFirstGregOfHijriMonth(year, month);
  const firstDOW   = firstGreg.getDay(); // 0=Sun

  const eventsMap = {};
  ISLAMIC_EVENTS.filter(e => e.month === month).forEach(e => { eventsMap[e.day] = e.name; });

  const isCurrentMonth = calTodayH && calTodayH.year === year && calTodayH.month === month;

  let html = `
    <div class="cal-header">
      <button class="cal-nav-btn" onclick="calPrevMonth()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="cal-title">
        <div class="cal-month-ar">${monthName}</div>
        <div class="cal-year-label">${year} هـ</div>
      </div>
      <button class="cal-nav-btn" onclick="calNextMonth()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
    <div class="cal-weekdays">
      ${DAYS_OF_WEEK_AR.map(d => `<div class="cal-wd">${d}</div>`).join('')}
    </div>
    <div class="cal-grid">
  `;

  // leading empty cells
  for (let i = 0; i < firstDOW; i++) html += '<div class="cal-cell"></div>';

  // day cells
  for (let d = 1; d <= monthLen; d++) {
    const gregDate = new Date(firstGreg.getTime() + (d - 1) * 86400000);
    const isFriday = gregDate.getDay() === 5;
    const isToday  = isCurrentMonth && calTodayH.day === d;
    const hasEvent = !!eventsMap[d];
    html += `
      <div class="cal-cell ${isToday ? 'cal-today' : ''} ${hasEvent ? 'cal-has-event' : ''} ${isFriday ? 'cal-friday' : ''}"
           ${hasEvent ? `onclick="showCalEvent('${eventsMap[d].replace(/'/g,"&#39;")}')"` : ''}>
        <span class="cal-day-num">${toArabicNum(d)}</span>
        ${hasEvent ? '<span class="cal-event-dot"></span>' : ''}
      </div>
    `;
  }

  html += '</div>';

  // events list
  const monthEvents = ISLAMIC_EVENTS.filter(e => e.month === month);
  if (monthEvents.length > 0) {
    html += `<div class="cal-events-section"><div class="section-title" style="margin-top:16px">مناسبات ${monthName}</div>`;
    monthEvents.forEach(e => {
      html += `
        <div class="cal-event-row">
          <span class="cal-event-day-badge">${toArabicNum(e.day)}</span>
          <span class="cal-event-name">${e.name}</span>
        </div>
      `;
    });
    html += '</div>';
  }

  container.innerHTML = html;
}

function showCalEvent(name) {
  showToast(name);
}

// ─── TOOLS (Qibla / Names / Fasting) ────────────────────────────────

let toolsSectionState = { qibla: true, names: false, fasting: false };

function initToolsTab() {
  if (!toolsInitDone.qibla) {
    toolsInitDone.qibla = true;
    initQibla();
  }
  renderToolsSections();
}

function renderToolsSections() {
  ['qibla','names','fasting'].forEach(key => {
    const body  = document.getElementById(`tools-${key}-body`);
    const arrow = document.getElementById(`tools-${key}-arrow`);
    if (body)  body.style.display = toolsSectionState[key] ? 'block' : 'none';
    if (arrow) arrow.textContent  = toolsSectionState[key] ? '▲' : '▼';
  });
}

function toggleToolsSection(key) {
  toolsSectionState[key] = !toolsSectionState[key];
  if (toolsSectionState[key]) {
    if (key === 'names'   && !toolsInitDone.names)   { toolsInitDone.names   = true; initNames(); }
    if (key === 'fasting' && !toolsInitDone.fasting) { toolsInitDone.fasting = true; initFasting(); }
  }
  renderToolsSections();
}

// ─── BOOKMARKS ───────────────────────────────────────────────────────

const BM_ICONS = { hadith:'📖', dhikr:'📿', dua:'🤲', ayah:'🌙' };
const BM_LABELS = { hadith:'حديث', dhikr:'ذكر', dua:'دعاء', ayah:'آية' };

function getBookmarks() {
  return JSON.parse(localStorage.getItem('anees_bookmarks') || '[]');
}

function _saveBookmarks(bm) {
  localStorage.setItem('anees_bookmarks', JSON.stringify(bm));
}

function isBookmarked(refId) {
  return getBookmarks().some(b => b.refId === refId);
}

function toggleBookmark(refId, data) {
  const bm = getBookmarks();
  const idx = bm.findIndex(b => b.refId === refId);
  if (idx >= 0) {
    bm.splice(idx, 1);
    _saveBookmarks(bm);
    showToast('تم الحذف من المحفوظات');
    renderProfileCard();
    return false;
  } else {
    bm.unshift({ id: Date.now().toString(), refId, ...data, savedAt: Date.now() });
    _saveBookmarks(bm.slice(0, 200));
    showToast('تم الحفظ في المحفوظات ✓');
    renderProfileCard();
    return true;
  }
}

function removeBookmark(id) {
  const bm = getBookmarks().filter(b => b.id !== id);
  _saveBookmarks(bm);
  showToast('تم الحذف');
  renderBookmarks();
  renderProfileCard();
}

function renderBookmarks() {
  const container = document.getElementById('profile-bookmarks-list');
  if (!container) return;

  const bm = getBookmarks();
  if (bm.length === 0) {
    container.innerHTML = `
      <div class="bookmarks-empty">
        <div style="font-size:44px;margin-bottom:12px">🔖</div>
        <div style="font-family:'Amiri',serif;font-size:20px;color:var(--text);margin-bottom:6px">لا يوجد محفوظات بعد</div>
        <div style="font-size:13px;color:var(--text-muted);line-height:1.6">اضغط على 🔖 بجانب أي حديث أو ذكر أو دعاء لحفظه هنا</div>
      </div>
    `;
    return;
  }

  container.innerHTML = bm.map(b => `
    <div class="bookmark-card">
      <div class="bookmark-card-top">
        <span class="bookmark-type-badge">${BM_ICONS[b.type] || '🔖'} ${BM_LABELS[b.type] || ''}</span>
        <button class="bookmark-delete-btn" onclick="removeBookmark('${b.id}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      ${b.title ? `<div class="bookmark-title">${b.title}</div>` : ''}
      <div class="bookmark-arabic">${b.arabic || ''}</div>
      ${b.translation ? `<div class="bookmark-trans">${b.translation}</div>` : ''}
      ${b.source ? `<span class="source-tag">${b.source}</span>` : ''}
    </div>
  `).join('');
}

// Bookmark button HTML helper — called from dhikr.js / prayer.js renders
function bmBtn(refId, type, data) {
  const saved = isBookmarked(refId);
  const dataAttrs = Object.entries(data)
    .map(([k, v]) => `data-bm-${k}="${(v||'').replace(/"/g,'&quot;')}"`)
    .join(' ');
  return `<button class="bm-btn ${saved ? 'bm-saved' : ''}" ${dataAttrs}
    data-bm-refid="${refId}" data-bm-type="${type}"
    onclick="onBmBtn(this)">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  </button>`;
}

function onBmBtn(btn) {
  const refId = btn.dataset.bmRefid;
  const type  = btn.dataset.bmType;
  const data  = {
    type,
    arabic:      btn.dataset.bmArabic      || '',
    translation: btn.dataset.bmTranslation || '',
    source:      btn.dataset.bmSource      || '',
    title:       btn.dataset.bmTitle       || '',
  };
  const saved = toggleBookmark(refId, data);
  btn.classList.toggle('bm-saved', saved);
  btn.querySelector('svg').setAttribute('fill', saved ? 'currentColor' : 'none');
}
