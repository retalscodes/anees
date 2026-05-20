const SURAHS = [
  {n:1,ar:"الفاتحة",en:"Al-Fatiha",v:7},{n:2,ar:"البقرة",en:"Al-Baqara",v:286},
  {n:3,ar:"آل عمران",en:"Aal-E-Imran",v:200},{n:4,ar:"النساء",en:"An-Nisa",v:176},
  {n:5,ar:"المائدة",en:"Al-Ma'ida",v:120},{n:6,ar:"الأنعام",en:"Al-An'am",v:165},
  {n:7,ar:"الأعراف",en:"Al-A'raf",v:206},{n:8,ar:"الأنفال",en:"Al-Anfal",v:75},
  {n:9,ar:"التوبة",en:"At-Tawba",v:129},{n:10,ar:"يونس",en:"Yunus",v:109},
  {n:11,ar:"هود",en:"Hud",v:123},{n:12,ar:"يوسف",en:"Yusuf",v:111},
  {n:13,ar:"الرعد",en:"Ar-Ra'd",v:43},{n:14,ar:"إبراهيم",en:"Ibrahim",v:52},
  {n:15,ar:"الحجر",en:"Al-Hijr",v:99},{n:16,ar:"النحل",en:"An-Nahl",v:128},
  {n:17,ar:"الإسراء",en:"Al-Isra",v:111},{n:18,ar:"الكهف",en:"Al-Kahf",v:110},
  {n:19,ar:"مريم",en:"Maryam",v:98},{n:20,ar:"طه",en:"Ta-Ha",v:135},
  {n:21,ar:"الأنبياء",en:"Al-Anbiya",v:112},{n:22,ar:"الحج",en:"Al-Hajj",v:78},
  {n:23,ar:"المؤمنون",en:"Al-Mu'minun",v:118},{n:24,ar:"النور",en:"An-Nur",v:64},
  {n:25,ar:"الفرقان",en:"Al-Furqan",v:77},{n:26,ar:"الشعراء",en:"Ash-Shu'ara",v:227},
  {n:27,ar:"النمل",en:"An-Naml",v:93},{n:28,ar:"القصص",en:"Al-Qasas",v:88},
  {n:29,ar:"العنكبوت",en:"Al-'Ankabut",v:69},{n:30,ar:"الروم",en:"Ar-Rum",v:60},
  {n:31,ar:"لقمان",en:"Luqman",v:34},{n:32,ar:"السجدة",en:"As-Sajda",v:30},
  {n:33,ar:"الأحزاب",en:"Al-Ahzab",v:73},{n:34,ar:"سبأ",en:"Saba",v:54},
  {n:35,ar:"فاطر",en:"Fatir",v:45},{n:36,ar:"يس",en:"Ya-Sin",v:83},
  {n:37,ar:"الصافات",en:"As-Saffat",v:182},{n:38,ar:"ص",en:"Sad",v:88},
  {n:39,ar:"الزمر",en:"Az-Zumar",v:75},{n:40,ar:"غافر",en:"Ghafir",v:85},
  {n:41,ar:"فصلت",en:"Fussilat",v:54},{n:42,ar:"الشورى",en:"Ash-Shura",v:53},
  {n:43,ar:"الزخرف",en:"Az-Zukhruf",v:89},{n:44,ar:"الدخان",en:"Ad-Dukhan",v:59},
  {n:45,ar:"الجاثية",en:"Al-Jathiya",v:37},{n:46,ar:"الأحقاف",en:"Al-Ahqaf",v:35},
  {n:47,ar:"محمد",en:"Muhammad",v:38},{n:48,ar:"الفتح",en:"Al-Fath",v:29},
  {n:49,ar:"الحجرات",en:"Al-Hujurat",v:18},{n:50,ar:"ق",en:"Qaf",v:45},
  {n:51,ar:"الذاريات",en:"Adh-Dhariyat",v:60},{n:52,ar:"الطور",en:"At-Tur",v:49},
  {n:53,ar:"النجم",en:"An-Najm",v:62},{n:54,ar:"القمر",en:"Al-Qamar",v:55},
  {n:55,ar:"الرحمن",en:"Ar-Rahman",v:78},{n:56,ar:"الواقعة",en:"Al-Waqi'a",v:96},
  {n:57,ar:"الحديد",en:"Al-Hadid",v:29},{n:58,ar:"المجادلة",en:"Al-Mujadila",v:22},
  {n:59,ar:"الحشر",en:"Al-Hashr",v:24},{n:60,ar:"الممتحنة",en:"Al-Mumtahana",v:13},
  {n:61,ar:"الصف",en:"As-Saf",v:14},{n:62,ar:"الجمعة",en:"Al-Jumu'a",v:11},
  {n:63,ar:"المنافقون",en:"Al-Munafiqun",v:11},{n:64,ar:"التغابن",en:"At-Taghabun",v:18},
  {n:65,ar:"الطلاق",en:"At-Talaq",v:12},{n:66,ar:"التحريم",en:"At-Tahrim",v:12},
  {n:67,ar:"الملك",en:"Al-Mulk",v:30},{n:68,ar:"القلم",en:"Al-Qalam",v:52},
  {n:69,ar:"الحاقة",en:"Al-Haaqqa",v:52},{n:70,ar:"المعارج",en:"Al-Ma'arij",v:44},
  {n:71,ar:"نوح",en:"Nuh",v:28},{n:72,ar:"الجن",en:"Al-Jinn",v:28},
  {n:73,ar:"المزمل",en:"Al-Muzzammil",v:20},{n:74,ar:"المدثر",en:"Al-Muddaththir",v:56},
  {n:75,ar:"القيامة",en:"Al-Qiyama",v:40},{n:76,ar:"الإنسان",en:"Al-Insan",v:31},
  {n:77,ar:"المرسلات",en:"Al-Mursalat",v:50},{n:78,ar:"النبأ",en:"An-Naba",v:40},
  {n:79,ar:"النازعات",en:"An-Nazi'at",v:46},{n:80,ar:"عبس",en:"Abasa",v:42},
  {n:81,ar:"التكوير",en:"At-Takwir",v:29},{n:82,ar:"الانفطار",en:"Al-Infitar",v:19},
  {n:83,ar:"المطففين",en:"Al-Mutaffifin",v:36},{n:84,ar:"الانشقاق",en:"Al-Inshiqaq",v:25},
  {n:85,ar:"البروج",en:"Al-Buruj",v:22},{n:86,ar:"الطارق",en:"At-Tariq",v:17},
  {n:87,ar:"الأعلى",en:"Al-A'la",v:19},{n:88,ar:"الغاشية",en:"Al-Ghashiya",v:26},
  {n:89,ar:"الفجر",en:"Al-Fajr",v:30},{n:90,ar:"البلد",en:"Al-Balad",v:20},
  {n:91,ar:"الشمس",en:"Ash-Shams",v:15},{n:92,ar:"الليل",en:"Al-Layl",v:21},
  {n:93,ar:"الضحى",en:"Ad-Dhuha",v:11},{n:94,ar:"الشرح",en:"Ash-Sharh",v:8},
  {n:95,ar:"التين",en:"At-Tin",v:8},{n:96,ar:"العلق",en:"Al-'Alaq",v:19},
  {n:97,ar:"القدر",en:"Al-Qadr",v:5},{n:98,ar:"البينة",en:"Al-Bayyina",v:8},
  {n:99,ar:"الزلزلة",en:"Az-Zalzala",v:8},{n:100,ar:"العاديات",en:"Al-'Adiyat",v:11},
  {n:101,ar:"القارعة",en:"Al-Qari'a",v:11},{n:102,ar:"التكاثر",en:"At-Takathur",v:8},
  {n:103,ar:"العصر",en:"Al-'Asr",v:3},{n:104,ar:"الهمزة",en:"Al-Humaza",v:9},
  {n:105,ar:"الفيل",en:"Al-Fil",v:5},{n:106,ar:"قريش",en:"Quraysh",v:4},
  {n:107,ar:"الماعون",en:"Al-Ma'un",v:7},{n:108,ar:"الكوثر",en:"Al-Kawthar",v:3},
  {n:109,ar:"الكافرون",en:"Al-Kafirun",v:6},{n:110,ar:"النصر",en:"An-Nasr",v:3},
  {n:111,ar:"المسد",en:"Al-Masad",v:5},{n:112,ar:"الإخلاص",en:"Al-Ikhlas",v:4},
  {n:113,ar:"الفلق",en:"Al-Falaq",v:5},{n:114,ar:"الناس",en:"An-Nas",v:6},
];

let wirdData = { goal: 10, completed: 0, streak: 0, lastDate: null, log: [] };

function initQuran() {
  loadWirdData();
  renderWirdCard();
  loadAyahOfDay();
  renderSurahGrid(SURAHS);
}

// ─── Ayah of the Day ───────────────────────────────────────────
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
    })
    .catch(() => {
      const card = document.getElementById('ayah-card');
      if (card) card.style.display = 'none';
    });
}

// ─── Surah Browser ─────────────────────────────────────────────
function renderSurahGrid(surahs) {
  const grid = document.getElementById('surah-grid');
  if (!grid) return;
  grid.innerHTML = surahs.map(s => `
    <div class="surah-card" onclick="openSurahReader(${s.n})">
      <span class="surah-v">${s.v} آية</span>
      <div class="surah-names">
        <div class="surah-ar">${s.ar}</div>
        <div class="surah-en">${s.en}</div>
      </div>
      <span class="surah-num-badge">${s.n}</span>
    </div>
  `).join('');
}

function filterSurahs(query) {
  if (!query.trim()) { renderSurahGrid(SURAHS); return; }
  const q = query.trim().toLowerCase();
  const filtered = SURAHS.filter(s =>
    s.ar.includes(q) ||
    s.en.toLowerCase().includes(q) ||
    String(s.n) === q
  );
  renderSurahGrid(filtered);
}

// ─── Surah Reader ───────────────────────────────────────────────
async function openSurahReader(n) {
  const surah = SURAHS[n - 1];
  document.getElementById('quran-browser').style.display = 'none';
  const reader = document.getElementById('surah-reader');
  reader.style.display = 'block';

  document.getElementById('reader-title').innerHTML =
    `<span style="font-family:'Amiri',serif;font-size:18px">${surah.ar}</span>`;

  const verses = document.getElementById('reader-verses');
  verses.innerHTML = '<div class="center muted" style="padding:30px">جاري التحميل...</div>';
  document.getElementById('page-quran').scrollTop = 0;

  try {
    const resp = await fetch(`/api/quran/surah/${n}`);
    const data = await resp.json();
    if (!data.data || !data.data[0]) throw new Error('No data');

    const arAyahs = data.data[0].ayahs;
    const enAyahs = (data.data[1] || {}).ayahs || [];

    let html = '';
    if (n !== 9) {
      html += `<div class="bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>`;
    }

    html += arAyahs.map((ayah, i) => {
      const en = enAyahs[i];
      return `
        <div class="verse-item">
          <div class="verse-arabic">
            ${ayah.text}
            <span class="verse-num">${toArabicNum(ayah.numberInSurah)}</span>
          </div>
          ${en ? `<div class="verse-translation">${en.text}</div>` : ''}
        </div>
      `;
    }).join('');

    verses.innerHTML = html;
  } catch {
    verses.innerHTML = '<div class="center muted" style="padding:30px">تعذر تحميل السورة. تحقق من الاتصال بالإنترنت.</div>';
  }
}

function closeSurahReader() {
  document.getElementById('surah-reader').style.display = 'none';
  document.getElementById('quran-browser').style.display = 'block';
}

function toArabicNum(n) {
  const d = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  return String(n).split('').map(c => d[+c] ?? c).join('');
}

// ─── Wird Tracker ───────────────────────────────────────────────
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
