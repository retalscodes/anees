let qaHistory = [];

function initQA() {
  const form = document.getElementById('qa-form');
  const input = document.getElementById('qa-input');
  const submit = document.getElementById('qa-submit');

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitQuestion();
    }
  });

  submit.addEventListener('click', submitQuestion);
}

function isArabic(text) {
  const arabicChars = (text.match(/[؀-ۿ]/g) || []).length;
  return arabicChars > text.length * 0.2;
}

async function submitQuestion() {
  const input = document.getElementById('qa-input');
  const submit = document.getElementById('qa-submit');
  const question = input.value.trim();

  if (!question) return;

  const arabic = isArabic(question);

  addMessage('user', question, arabic);
  input.value = '';
  input.style.height = 'auto';
  submit.disabled = true;

  const loadingId = addLoadingMessage();

  try {
    const resp = await fetch('/api/qa/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!resp.ok) throw new Error('Request failed');
    const data = await resp.json();
    removeMessage(loadingId);
    addMessage('assistant', data.answer);
  } catch (e) {
    removeMessage(loadingId);
    addMessage('assistant', arabic
      ? 'عذرًا، حدث خطأ. يرجى المحاولة مرة أخرى.'
      : 'Sorry, an error occurred. Please try again.');
  } finally {
    submit.disabled = false;
  }
}

function addMessage(role, text, arabic = false) {
  const container = document.getElementById('qa-messages');
  const id = 'msg-' + Date.now();
  const div = document.createElement('div');
  div.id = id;
  div.className = `qa-message ${role}${role === 'user' && !arabic ? ' ltr' : ''}`;
  div.textContent = text;
  container.appendChild(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'end' });
  return id;
}

function addLoadingMessage() {
  const container = document.getElementById('qa-messages');
  const id = 'msg-loading-' + Date.now();
  const div = document.createElement('div');
  div.id = id;
  div.className = 'qa-message loading';
  div.innerHTML = '<span class="dots">جاري البحث في المصادر</span>';
  container.appendChild(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'end' });
  return id;
}

function removeMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}
