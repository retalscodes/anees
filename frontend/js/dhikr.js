function markVerseNums(text) {
  return text.replace(/﴿([٠-٩\d]+)﴾/g,
    '<span class="v-num">$1</span>'
  );
}

let currentDhikrTab = 'morning';
let dhikrProgress = {};
let tasbihCount = 0;
let tasbihTarget = 33;
let tasbihMode = 0; // 0=33 SubhanAllah, 1=33 Alhamdulillah, 2=34 AllahuAkbar

const TASBIH_MODES = [
  { label: 'سبحان الله', target: 33 },
  { label: 'الحمد لله', target: 33 },
  { label: 'الله أكبر', target: 34 },
];

function initDhikr() {
  dhikrProgress = JSON.parse(localStorage.getItem('dhikrProgress') || '{}');
  const today = new Date().toDateString();
  if (dhikrProgress.date !== today) {
    dhikrProgress = { date: today };
    localStorage.setItem('dhikrProgress', JSON.stringify(dhikrProgress));
  }

  renderDhikrPage();
  initTasbih();
  renderDuas();
}

function renderDhikrPage() {
  const tabs = document.querySelectorAll('[data-dhikr-tab]');
  tabs.forEach(t => {
    t.classList.toggle('active', t.dataset.dhikrTab === currentDhikrTab);
    t.onclick = () => { currentDhikrTab = t.dataset.dhikrTab; renderDhikrPage(); };
  });

  const container = document.getElementById('dhikr-list');
  if (!container) return;

  if (currentDhikrTab === 'tasbih') {
    container.style.display = 'none';
    document.getElementById('tasbih-section').style.display = 'block';
    return;
  }

  if (currentDhikrTab === 'duas') {
    container.style.display = 'none';
    document.getElementById('tasbih-section').style.display = 'none';
    document.getElementById('duas-section').style.display = 'block';
    return;
  }

  document.getElementById('tasbih-section').style.display = 'none';
  document.getElementById('duas-section').style.display = 'none';
  container.style.display = 'block';

  const items = ATHKAR[currentDhikrTab] || [];
  container.innerHTML = items.map((item, idx) => {
    const key = `${currentDhikrTab}_${idx}`;
    const remaining = dhikrProgress[key] !== undefined
      ? Math.max(0, item.count - dhikrProgress[key])
      : item.count;
    const done = remaining === 0;

    return `
      <div class="dhikr-item" id="dhikr-${idx}">
        <div class="dhikr-header">
          <span class="dhikr-title">${item.title}</span>
          <span class="count-badge ${done ? 'done' : ''}">${done ? '✓' : remaining + 'x'}</span>
        </div>
        <div class="arabic">${markVerseNums(item.arabic)}</div>
        <div class="translation">${item.translation}</div>
        <div class="flex-between mt-8">
          <span class="source-tag">${item.source}</span>
          ${!done ? `<button class="dhikr-counter-btn" onclick="countDhikr('${currentDhikrTab}', ${idx}, ${item.count})" style="width:auto;padding:6px 16px;">اضغط للعدّ</button>` : '<span style="color:var(--gold);font-size:13px;">✓ تمّ</span>'}
        </div>
      </div>
    `;
  }).join('');
}

function countDhikr(tab, idx, total) {
  const key = `${tab}_${idx}`;
  dhikrProgress[key] = (dhikrProgress[key] || 0) + 1;
  localStorage.setItem('dhikrProgress', JSON.stringify(dhikrProgress));
  renderDhikrPage();

  const remaining = total - dhikrProgress[key];
  if (remaining === 0) showToast('أحسنت! ✓');
}

function initTasbih() {
  const btn = document.getElementById('tasbih-btn');
  const countEl = document.getElementById('tasbih-count');
  const labelEl = document.getElementById('tasbih-label');

  function updateDisplay() {
    countEl.textContent = tasbihCount;
    labelEl.textContent = TASBIH_MODES[tasbihMode].label;
    tasbihTarget = TASBIH_MODES[tasbihMode].target;
  }

  btn.addEventListener('click', () => {
    tasbihCount++;
    updateDisplay();

    if (tasbihCount >= tasbihTarget) {
      tasbihCount = 0;
      tasbihMode = (tasbihMode + 1) % 3;
      if (tasbihMode === 0) {
        showToast('مبارك! اكتملت التسبيحات 🤲');
      }
      updateDisplay();
    }
  });

  document.getElementById('tasbih-reset').addEventListener('click', () => {
    tasbihCount = 0;
    tasbihMode = 0;
    updateDisplay();
  });

  document.getElementById('tasbih-skip').addEventListener('click', () => {
    tasbihCount = 0;
    tasbihMode = (tasbihMode + 1) % 3;
    updateDisplay();
  });

  updateDisplay();
}

function renderDuas() {
  const container = document.getElementById('duas-list');
  if (!container) return;

  container.innerHTML = DUAS.map((cat, ci) => `
    <div class="dua-category">
      <div class="dua-cat-header" onclick="toggleDuaCategory(${ci})">
        <span class="cat-icon">${cat.icon}</span>
        <span>${cat.category}</span>
        <span style="margin-right:auto;color:var(--text-dim);font-size:12px;">${cat.categoryEn}</span>
        <span id="dua-arrow-${ci}" style="color:var(--text-dim)">▼</span>
      </div>
      <div id="dua-items-${ci}" style="display:none">
        ${cat.items.map(item => `
          <div class="card-sm">
            <div class="arabic-sm">${item.arabic}</div>
            <div class="translation">${item.translation}</div>
            <span class="source-tag">${item.source}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function toggleDuaCategory(idx) {
  const el = document.getElementById(`dua-items-${idx}`);
  const arrow = document.getElementById(`dua-arrow-${idx}`);
  const open = el.style.display === 'block';
  el.style.display = open ? 'none' : 'block';
  arrow.textContent = open ? '▼' : '▲';
}
