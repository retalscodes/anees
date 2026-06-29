// ─── Kids Mode ───────────────────────────────────────────────────────

let kidsCurrentStory = null;

function isKidsMode() {
  return document.documentElement.getAttribute('data-kids') === 'true';
}

function initKidsMode() {
  const enabled = localStorage.getItem('anees_kids_mode') === '1';
  applyKidsMode(enabled);
}

function applyKidsMode(enabled) {
  const html = document.documentElement;
  if (enabled) {
    html.setAttribute('data-kids', 'true');
    localStorage.setItem('anees_kids_mode', '1');
  } else {
    html.removeAttribute('data-kids');
    localStorage.setItem('anees_kids_mode', '0');
  }
  updateKidsToggleUI();
  updateNavForKidsMode(enabled);
}

function toggleKidsMode() {
  applyKidsMode(!isKidsMode());
  if (isKidsMode()) {
    showToast('🌟 وضع الأطفال مفعّل');
  } else {
    showToast('وضع الأطفال مُغلَق');
  }
}

function updateKidsToggleUI() {
  const toggle = document.getElementById('kids-mode-toggle');
  if (!toggle) return;
  const on = isKidsMode();
  toggle.textContent = on ? 'تغليق وضع الأطفال' : 'تفعيل وضع الأطفال 🌟';
  toggle.classList.toggle('kids-active', on);
}

function updateNavForKidsMode(enabled) {
  const askBtn = document.querySelector('[data-nav="ask"]');
  const storiesBtn = document.querySelector('[data-nav="stories"]');
  if (askBtn) askBtn.style.display = enabled ? 'none' : '';
  if (storiesBtn) storiesBtn.style.display = enabled ? '' : 'none';
}

// ─── Stories List ─────────────────────────────────────────────────────

function initStories() {
  renderStoryCards();
  const reader = document.getElementById('story-reader');
  if (reader) reader.style.display = 'none';
}

const STORY_COLORS_LIGHT = [
  '#FF8A65','#9C27B0','#1976D2','#2E7D32',
  '#F9A825','#00796B','#C62828','#1565C0',
  '#558B2F','#6A1B9A',
];

function renderStoryCards() {
  const grid = document.getElementById('story-grid');
  if (!grid || typeof STORIES === 'undefined') return;
  grid.innerHTML = STORIES.map((s, i) => `
    <button class="story-card" onclick="openStory('${s.id}')"
      style="--card-color:${s.color}; animation-delay:${i * 0.05}s">
      <div class="story-card-emoji">${s.emoji}</div>
      <div class="story-card-title">${s.title}</div>
    </button>
  `).join('');
}

function openStory(id) {
  const story = STORIES.find(s => s.id === id);
  if (!story) return;
  kidsCurrentStory = story;

  document.getElementById('story-reader-title').textContent = story.title;
  document.getElementById('story-reader-source').textContent = story.source;
  document.getElementById('story-reader-ref').textContent = story.sourceRef;
  document.getElementById('story-reader-body').textContent = story.text;
  document.getElementById('story-reader').style.setProperty('--story-color', story.color);

  document.getElementById('stories-list-view').style.display = 'none';
  document.getElementById('story-reader').style.display = 'flex';

  // scroll to top of page
  document.getElementById('page-stories').scrollTo(0, 0);
}

function closeStory() {
  document.getElementById('story-reader').style.display = 'none';
  document.getElementById('stories-list-view').style.display = 'block';
  kidsCurrentStory = null;
}

function prevStory() {
  if (!kidsCurrentStory) return;
  const idx = STORIES.findIndex(s => s.id === kidsCurrentStory.id);
  if (idx > 0) openStory(STORIES[idx - 1].id);
}

function nextStory() {
  if (!kidsCurrentStory) return;
  const idx = STORIES.findIndex(s => s.id === kidsCurrentStory.id);
  if (idx < STORIES.length - 1) openStory(STORIES[idx + 1].id);
}
