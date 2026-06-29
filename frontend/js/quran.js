const SURAHS = [
  {n:1,ar:"الفاتحة",en:"Al-Fatiha",v:7,p:1},{n:2,ar:"البقرة",en:"Al-Baqara",v:286,p:2},
  {n:3,ar:"آل عمران",en:"Aal-E-Imran",v:200,p:50},{n:4,ar:"النساء",en:"An-Nisa",v:176,p:77},
  {n:5,ar:"المائدة",en:"Al-Ma'ida",v:120,p:106},{n:6,ar:"الأنعام",en:"Al-An'am",v:165,p:128},
  {n:7,ar:"الأعراف",en:"Al-A'raf",v:206,p:151},{n:8,ar:"الأنفال",en:"Al-Anfal",v:75,p:177},
  {n:9,ar:"التوبة",en:"At-Tawba",v:129,p:187},{n:10,ar:"يونس",en:"Yunus",v:109,p:208},
  {n:11,ar:"هود",en:"Hud",v:123,p:221},{n:12,ar:"يوسف",en:"Yusuf",v:111,p:235},
  {n:13,ar:"الرعد",en:"Ar-Ra'd",v:43,p:249},{n:14,ar:"إبراهيم",en:"Ibrahim",v:52,p:255},
  {n:15,ar:"الحجر",en:"Al-Hijr",v:99,p:262},{n:16,ar:"النحل",en:"An-Nahl",v:128,p:267},
  {n:17,ar:"الإسراء",en:"Al-Isra",v:111,p:282},{n:18,ar:"الكهف",en:"Al-Kahf",v:110,p:293},
  {n:19,ar:"مريم",en:"Maryam",v:98,p:305},{n:20,ar:"طه",en:"Ta-Ha",v:135,p:312},
  {n:21,ar:"الأنبياء",en:"Al-Anbiya",v:112,p:322},{n:22,ar:"الحج",en:"Al-Hajj",v:78,p:332},
  {n:23,ar:"المؤمنون",en:"Al-Mu'minun",v:118,p:342},{n:24,ar:"النور",en:"An-Nur",v:64,p:350},
  {n:25,ar:"الفرقان",en:"Al-Furqan",v:77,p:359},{n:26,ar:"الشعراء",en:"Ash-Shu'ara",v:227,p:367},
  {n:27,ar:"النمل",en:"An-Naml",v:93,p:377},{n:28,ar:"القصص",en:"Al-Qasas",v:88,p:385},
  {n:29,ar:"العنكبوت",en:"Al-'Ankabut",v:69,p:396},{n:30,ar:"الروم",en:"Ar-Rum",v:60,p:404},
  {n:31,ar:"لقمان",en:"Luqman",v:34,p:411},{n:32,ar:"السجدة",en:"As-Sajda",v:30,p:415},
  {n:33,ar:"الأحزاب",en:"Al-Ahzab",v:73,p:418},{n:34,ar:"سبأ",en:"Saba",v:54,p:428},
  {n:35,ar:"فاطر",en:"Fatir",v:45,p:434},{n:36,ar:"يس",en:"Ya-Sin",v:83,p:440},
  {n:37,ar:"الصافات",en:"As-Saffat",v:182,p:446},{n:38,ar:"ص",en:"Sad",v:88,p:453},
  {n:39,ar:"الزمر",en:"Az-Zumar",v:75,p:458},{n:40,ar:"غافر",en:"Ghafir",v:85,p:467},
  {n:41,ar:"فصلت",en:"Fussilat",v:54,p:477},{n:42,ar:"الشورى",en:"Ash-Shura",v:53,p:483},
  {n:43,ar:"الزخرف",en:"Az-Zukhruf",v:89,p:489},{n:44,ar:"الدخان",en:"Ad-Dukhan",v:59,p:496},
  {n:45,ar:"الجاثية",en:"Al-Jathiya",v:37,p:499},{n:46,ar:"الأحقاف",en:"Al-Ahqaf",v:35,p:502},
  {n:47,ar:"محمد",en:"Muhammad",v:38,p:507},{n:48,ar:"الفتح",en:"Al-Fath",v:29,p:511},
  {n:49,ar:"الحجرات",en:"Al-Hujurat",v:18,p:515},{n:50,ar:"ق",en:"Qaf",v:45,p:518},
  {n:51,ar:"الذاريات",en:"Adh-Dhariyat",v:60,p:520},{n:52,ar:"الطور",en:"At-Tur",v:49,p:523},
  {n:53,ar:"النجم",en:"An-Najm",v:62,p:526},{n:54,ar:"القمر",en:"Al-Qamar",v:55,p:528},
  {n:55,ar:"الرحمن",en:"Ar-Rahman",v:78,p:531},{n:56,ar:"الواقعة",en:"Al-Waqi'a",v:96,p:534},
  {n:57,ar:"الحديد",en:"Al-Hadid",v:29,p:537},{n:58,ar:"المجادلة",en:"Al-Mujadila",v:22,p:542},
  {n:59,ar:"الحشر",en:"Al-Hashr",v:24,p:545},{n:60,ar:"الممتحنة",en:"Al-Mumtahana",v:13,p:549},
  {n:61,ar:"الصف",en:"As-Saf",v:14,p:551},{n:62,ar:"الجمعة",en:"Al-Jumu'a",v:11,p:553},
  {n:63,ar:"المنافقون",en:"Al-Munafiqun",v:11,p:554},{n:64,ar:"التغابن",en:"At-Taghabun",v:18,p:556},
  {n:65,ar:"الطلاق",en:"At-Talaq",v:12,p:558},{n:66,ar:"التحريم",en:"At-Tahrim",v:12,p:560},
  {n:67,ar:"الملك",en:"Al-Mulk",v:30,p:562},{n:68,ar:"القلم",en:"Al-Qalam",v:52,p:564},
  {n:69,ar:"الحاقة",en:"Al-Haaqqa",v:52,p:566},{n:70,ar:"المعارج",en:"Al-Ma'arij",v:44,p:568},
  {n:71,ar:"نوح",en:"Nuh",v:28,p:570},{n:72,ar:"الجن",en:"Al-Jinn",v:28,p:572},
  {n:73,ar:"المزمل",en:"Al-Muzzammil",v:20,p:574},{n:74,ar:"المدثر",en:"Al-Muddaththir",v:56,p:575},
  {n:75,ar:"القيامة",en:"Al-Qiyama",v:40,p:577},{n:76,ar:"الإنسان",en:"Al-Insan",v:31,p:578},
  {n:77,ar:"المرسلات",en:"Al-Mursalat",v:50,p:580},{n:78,ar:"النبأ",en:"An-Naba",v:40,p:582},
  {n:79,ar:"النازعات",en:"An-Nazi'at",v:46,p:583},{n:80,ar:"عبس",en:"Abasa",v:42,p:585},
  {n:81,ar:"التكوير",en:"At-Takwir",v:29,p:586},{n:82,ar:"الانفطار",en:"Al-Infitar",v:19,p:587},
  {n:83,ar:"المطففين",en:"Al-Mutaffifin",v:36,p:587},{n:84,ar:"الانشقاق",en:"Al-Inshiqaq",v:25,p:589},
  {n:85,ar:"البروج",en:"Al-Buruj",v:22,p:590},{n:86,ar:"الطارق",en:"At-Tariq",v:17,p:591},
  {n:87,ar:"الأعلى",en:"Al-A'la",v:19,p:591},{n:88,ar:"الغاشية",en:"Al-Ghashiya",v:26,p:592},
  {n:89,ar:"الفجر",en:"Al-Fajr",v:30,p:593},{n:90,ar:"البلد",en:"Al-Balad",v:20,p:594},
  {n:91,ar:"الشمس",en:"Ash-Shams",v:15,p:595},{n:92,ar:"الليل",en:"Al-Layl",v:21,p:595},
  {n:93,ar:"الضحى",en:"Ad-Dhuha",v:11,p:596},{n:94,ar:"الشرح",en:"Ash-Sharh",v:8,p:596},
  {n:95,ar:"التين",en:"At-Tin",v:8,p:597},{n:96,ar:"العلق",en:"Al-'Alaq",v:19,p:597},
  {n:97,ar:"القدر",en:"Al-Qadr",v:5,p:598},{n:98,ar:"البينة",en:"Al-Bayyina",v:8,p:598},
  {n:99,ar:"الزلزلة",en:"Az-Zalzala",v:8,p:599},{n:100,ar:"العاديات",en:"Al-'Adiyat",v:11,p:599},
  {n:101,ar:"القارعة",en:"Al-Qari'a",v:11,p:600},{n:102,ar:"التكاثر",en:"At-Takathur",v:8,p:600},
  {n:103,ar:"العصر",en:"Al-'Asr",v:3,p:601},{n:104,ar:"الهمزة",en:"Al-Humaza",v:9,p:601},
  {n:105,ar:"الفيل",en:"Al-Fil",v:5,p:601},{n:106,ar:"قريش",en:"Quraysh",v:4,p:602},
  {n:107,ar:"الماعون",en:"Al-Ma'un",v:7,p:602},{n:108,ar:"الكوثر",en:"Al-Kawthar",v:3,p:602},
  {n:109,ar:"الكافرون",en:"Al-Kafirun",v:6,p:603},{n:110,ar:"النصر",en:"An-Nasr",v:3,p:603},
  {n:111,ar:"المسد",en:"Al-Masad",v:5,p:603},{n:112,ar:"الإخلاص",en:"Al-Ikhlas",v:4,p:604},
  {n:113,ar:"الفلق",en:"Al-Falaq",v:5,p:604},{n:114,ar:"الناس",en:"An-Nas",v:6,p:604},
];

let wirdData = { goal: 10, completed: 0, streak: 0, lastDate: null, log: [] };

// ─── Page viewer state ───────────────────────────────────────────────
let mushafPage = 1;
const pageCache = {};
let mushafTouchStartX = 0;
let mushafTouchStartY = 0;

function initQuran() {
  loadWirdData();
  renderWirdCard();
  loadAyahOfDay();
  initMushafViewer();
}

// ─── Ayah of the Day ────────────────────────────────────────────────
function loadAyahOfDay() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start) / 86400000);
  const ayahNum = (dayOfYear % 6236) + 1;

  fetch(`https://api.alquran.cloud/v1/ayah/${ayahNum}/editions/quran-simple,en.asad`)
    .then(r => r.json())
    .then(data => {
      if (!data.data || !data.data[0]) return;
      const ar = data.data[0];
      const en = data.data[1];
      document.getElementById('ayah-arabic').textContent = ar.text;
      document.getElementById('ayah-translation').textContent = en ? en.text : '';
      document.getElementById('ayah-ref').textContent =
        `${ar.surah.name} — الآية ${toArabicNum(ar.numberInSurah)}`;

      // Bookmark button
      const refId = `ayah_${ar.surah.number}_${ar.numberInSurah}`;
      const bmContainer = document.getElementById('ayah-bm-btn');
      if (bmContainer && typeof bmBtn === 'function') {
        bmContainer.innerHTML = bmBtn(refId, 'ayah', {
          arabic: ar.text,
          translation: en ? en.text : '',
          source: `${ar.surah.name}، الآية ${ar.numberInSurah}`,
          title: 'آية اليوم'
        });
      }
    })
    .catch(() => {
      const card = document.getElementById('ayah-card');
      if (card) card.style.display = 'none';
    });
}

// ─── Mushaf Page Viewer ─────────────────────────────────────────────

function initMushafViewer() {
  mushafPage = parseInt(localStorage.getItem('anees_mushaf_page') || '1');
  updateMushafMemoBadge();
  loadMushafPage(mushafPage);
  setupMushafSwipe();
}

function setupMushafSwipe() {
  const viewer = document.getElementById('mushaf-content');
  if (!viewer) return;
  viewer.addEventListener('touchstart', e => {
    mushafTouchStartX = e.touches[0].clientX;
    mushafTouchStartY = e.touches[0].clientY;
  }, { passive: true });
  viewer.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - mushafTouchStartX;
    const dy = e.changedTouches[0].clientY - mushafTouchStartY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) mushafNextPage();
      else mushafPrevPage();
    }
  }, { passive: true });
}

async function loadMushafPage(n) {
  if (n < 1 || n > 604) return;
  mushafPage = n;
  localStorage.setItem('anees_mushaf_page', n);
  updateMushafNav();
  updateMushafMemoBadge();

  const content = document.getElementById('mushaf-content');
  if (!content) return;

  if (pageCache[n]) {
    renderMushafContent(pageCache[n]);
    return;
  }

  content.innerHTML = '<div class="mushaf-loading"><div class="spinner"></div><div style="margin-top:12px;font-family:\'Amiri\',serif;font-size:16px;color:var(--text-muted)">جاري تحميل الصفحة...</div></div>';

  try {
    const resp = await fetch(`https://api.alquran.cloud/v1/page/${n}/quran-uthmani`);
    const data = await resp.json();
    if (!data.data || !data.data.ayahs) throw new Error();
    pageCache[n] = data.data.ayahs;
    renderMushafContent(pageCache[n]);
  } catch {
    content.innerHTML = '<div class="center muted" style="padding:40px;font-family:\'Amiri\',serif;font-size:16px">تعذر تحميل الصفحة. تحقق من الاتصال.</div>';
  }
}

function renderMushafContent(ayahs) {
  const content = document.getElementById('mushaf-content');
  if (!content) return;

  // Group by surah to show surah headers
  let html = '';
  let lastSurahNum = null;

  ayahs.forEach(ayah => {
    const surahNum = ayah.surah.number;
    if (surahNum !== lastSurahNum) {
      lastSurahNum = surahNum;
      if (surahNum !== 9) { // No bismillah for Al-Tawba
        html += `
          <div class="mushaf-surah-header">
            <div class="mushaf-surah-name">سُورَةُ ${ayah.surah.name.replace('سورة','').trim()}</div>
            <div class="mushaf-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          </div>
        `;
      } else {
        html += `<div class="mushaf-surah-header"><div class="mushaf-surah-name">سُورَةُ التَّوْبَة</div></div>`;
      }
    }
  });

  // Render as continuous flowing text with verse markers
  html = '';
  lastSurahNum = null;

  ayahs.forEach(ayah => {
    const surahNum = ayah.surah.number;
    if (surahNum !== lastSurahNum) {
      lastSurahNum = surahNum;
      html += `<div class="mushaf-surah-header">
        <div class="mushaf-surah-name">${ayah.surah.name}</div>
        ${surahNum !== 9 && ayah.numberInSurah === 1
          ? '<div class="mushaf-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>'
          : ''}
      </div>`;
    }
    html += `<span class="mushaf-verse">${ayah.text} <span class="mushaf-vnum">${toArabicNum(ayah.numberInSurah)}</span> </span>`;
  });

  content.innerHTML = `<div class="mushaf-page-text" dir="rtl">${html}</div>`;
}

function mushafPrevPage() {
  if (mushafPage > 1) loadMushafPage(mushafPage - 1);
}

function mushafNextPage() {
  if (mushafPage < 604) loadMushafPage(mushafPage + 1);
}

// Called externally (e.g. mood recommender) to jump directly to a page
function goToMushafPage(n) {
  n = Math.max(1, Math.min(604, parseInt(n) || 1));
  if (typeof loadMushafPage === 'function') loadMushafPage(n);
}

function updateMushafNav() {
  const label = document.getElementById('mushaf-page-label');
  if (label) label.textContent = `صفحة ${toArabicNum(mushafPage)} من ٦٠٤`;
  const prev = document.getElementById('mushaf-prev-btn');
  const next = document.getElementById('mushaf-next-btn');
  if (prev) prev.disabled = mushafPage <= 1;
  if (next) next.disabled = mushafPage >= 604;
}

function openMushafGoto() {
  const modal = document.getElementById('mushaf-goto-modal');
  if (!modal) return;
  const input = document.getElementById('mushaf-goto-input');
  if (input) { input.value = mushafPage; input.select(); }
  modal.style.display = 'flex';
}

function confirmMushafGoto() {
  const val = parseInt(document.getElementById('mushaf-goto-input')?.value || '1');
  if (val >= 1 && val <= 604) {
    loadMushafPage(val);
    document.getElementById('mushaf-goto-modal').style.display = 'none';
  } else {
    showToast('الصفحات من ١ إلى ٦٠٤');
  }
}

// ─── Memorization ────────────────────────────────────────────────────

function getMemorizedPages() {
  return JSON.parse(localStorage.getItem('anees_memorized_pages') || '[]');
}

function togglePageMemorized() {
  const pages = getMemorizedPages();
  const idx = pages.indexOf(mushafPage);
  if (idx >= 0) {
    pages.splice(idx, 1);
    showToast('تم إلغاء تحديد الصفحة');
  } else {
    pages.push(mushafPage);
    showToast('ما شاء الله! تم حفظ الصفحة 📖');
  }
  localStorage.setItem('anees_memorized_pages', JSON.stringify(pages));
  updateMushafMemoBadge();
  if (typeof renderProfileCard === 'function') renderProfileCard();
}

function updateMushafMemoBadge() {
  const pages  = getMemorizedPages();
  const isMemo = pages.includes(mushafPage);
  const btn  = document.getElementById('mushaf-memo-btn');
  const stat = document.getElementById('mushaf-memo-stat');
  if (btn) {
    btn.classList.toggle('memorized', isMemo);
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="${isMemo ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
      <span>${isMemo ? 'صفحة محفوظة ✓' : 'حفظت هذه الصفحة'}</span>
    `;
  }
  if (stat) stat.textContent = `${pages.length} / ٦٠٤ صفحة محفوظة`;
}

function toArabicNum(n) {
  const d = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(n).split('').map(c => d[+c] ?? c).join('');
}

// ─── Wird Tracker ────────────────────────────────────────────────────
function loadWirdData() {
  const saved = localStorage.getItem('wirdData');
  if (saved) wirdData = { ...wirdData, ...JSON.parse(saved) };

  const today = new Date().toDateString();
  if (wirdData.lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (wirdData.lastDate === yesterday.toDateString() && wirdData.completed >= wirdData.goal) {
      wirdData.streak = (wirdData.streak || 0) + 1;
    } else if (wirdData.completed < wirdData.goal && wirdData.lastDate) {
      wirdData.streak = 0;
    }
    if (wirdData.lastDate && wirdData.lastDate !== today) {
      wirdData.log = wirdData.log || [];
      wirdData.log.unshift({ date: wirdData.lastDate, pages: wirdData.completed, goal: wirdData.goal });
      wirdData.log = wirdData.log.slice(0, 30);
      wirdData.completed = 0;
    }
    wirdData.lastDate = today;
    saveWirdData();
  }
}

function saveWirdData() {
  localStorage.setItem('wirdData', JSON.stringify(wirdData));
}

function renderWirdCard() {
  const pct = Math.min(100, Math.round((wirdData.completed / wirdData.goal) * 100));
  const done = wirdData.completed >= wirdData.goal;
  const circumference = 2 * Math.PI * 48;
  const offset = circumference - (pct / 100) * circumference;

  document.getElementById('wird-ring-svg').innerHTML = `
    <circle cx="60" cy="60" r="48" fill="none" stroke="var(--border)" stroke-width="8"/>
    <circle cx="60" cy="60" r="48" fill="none" stroke="${done ? 'var(--gold)' : 'var(--primary)'}"
      stroke-width="8" stroke-linecap="round"
      stroke-dasharray="${circumference}"
      stroke-dashoffset="${offset}"
      style="transition:stroke-dashoffset 0.5s ease"/>
  `;

  document.getElementById('wird-pct').textContent = pct + '%';
  document.getElementById('wird-sub').textContent = `${wirdData.completed}/${wirdData.goal} صفحة`;
  document.getElementById('streak-count').textContent = wirdData.streak;

  const addBtn = document.getElementById('wird-add-btn');
  addBtn.textContent = done ? '✓ اكتمل الورد' : '+ صفحة';
  addBtn.className = 'wird-btn ' + (done ? '' : 'primary');
  addBtn.onclick = done ? null : addWirdPage;
}

function addWirdPage() {
  wirdData.completed++;
  saveWirdData();
  renderWirdCard();
  if (wirdData.completed >= wirdData.goal) {
    showToast('ما شاء الله! اكتمل الورد اليومي 🌙');
    wirdData.streak = (wirdData.streak || 0) + 1;
    saveWirdData();
    renderWirdCard();
    if (typeof renderProfileCard === 'function') renderProfileCard();
  }
}

function setWirdGoal() {
  const val = parseInt(document.getElementById('wird-goal-input').value);
  if (val > 0 && val <= 604) {
    wirdData.goal = val;
    saveWirdData();
    renderWirdCard();
    showToast('تم حفظ الهدف');
  }
}
