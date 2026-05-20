let wirdData = {
  goal: 10,        // pages per day
  completed: 0,
  streak: 0,
  lastDate: null,
  log: [],
};

function initQuran() {
  loadWirdData();
  renderWirdCard();
  renderReadingLog();
}

function loadWirdData() {
  const saved = localStorage.getItem('wirdData');
  if (saved) {
    wirdData = { ...wirdData, ...JSON.parse(saved) };
  }

  // Reset daily progress if new day
  const today = new Date().toDateString();
  if (wirdData.lastDate !== today) {
    // Check streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (wirdData.lastDate === yesterday.toDateString() && wirdData.completed >= wirdData.goal) {
      wirdData.streak = (wirdData.streak || 0) + 1;
    } else if (wirdData.lastDate !== today) {
      if (wirdData.completed < wirdData.goal && wirdData.lastDate) {
        wirdData.streak = 0;
      }
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

function renderReadingLog() {
  const container = document.getElementById('reading-log');
  if (!container) return;
  if (!wirdData.log || wirdData.log.length === 0) {
    container.innerHTML = '<p class="muted center" style="padding:16px">لا يوجد سجل بعد</p>';
    return;
  }

  container.innerHTML = wirdData.log.map(entry => {
    const done = entry.pages >= entry.goal;
    const d = new Date(entry.date);
    const label = d.toLocaleDateString('ar-JO', { weekday: 'short', day: 'numeric', month: 'short' });
    return `
      <div class="flex-between" style="padding:10px 0;border-bottom:1px solid var(--border)">
        <span class="muted">${label}</span>
        <span style="color:${done ? 'var(--gold)' : 'var(--text-muted)'}">
          ${entry.pages}/${entry.goal} ${done ? '✓' : ''}
        </span>
      </div>
    `;
  }).join('');
}
