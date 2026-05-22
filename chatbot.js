

const OPENROUTER_API_KEY = 'import.meta.env.VITE_API_KEY';

const fnHistory = [];
let fnBusy = false;

const FN_SYSTEM = `You are FocusNest AI 🦉 — a friendly, encouraging study assistant built into FocusNest,
a smart productivity platform for students.

FocusNest features:
• Smart Task Manager — create subjects, set deadlines, track progress
• Focus Timer — Pomodoro technique (25 min study / 5 min break cycles)
• Performance Dashboard — productivity stats and completion rates
• Resource Library — store notes, papers, study materials
• Resource Explorer — discover new study resources

Your behaviour:
- Help students study smarter, manage time, and stay motivated
- Answer questions about FocusNest features clearly and concisely
- Give actionable study tips, Pomodoro advice, and exam strategies
- Keep every reply to 2–4 sentences max — friendly, warm, encouraging
- Use an occasional relevant emoji (don't overdo it)
- Never go off-topic or give harmful content`;

const fab   = document.getElementById('fn-fab');
const chat  = document.getElementById('fn-chat');
const badge = document.getElementById('fn-badge');

fab.addEventListener('click', () => {
  const opening = !chat.classList.contains('visible');
  chat.classList.toggle('visible', opening);
  fab.classList.toggle('is-open', opening);
  badge.style.display = 'none';

  if (opening) {
    if (fnHistory.length === 0) {
      fnAddMsg('bot', "Hey there! 👋 I'm your FocusNest AI — ask me about study tips, the Pomodoro timer, task management, or anything about FocusNest!");
    }
    setTimeout(() => document.getElementById('fn-input').focus(), 300);
  }
});


async function fnSend() {
  const input = document.getElementById('fn-input');
  const text  = input.value.trim();
  if (!text || fnBusy) return;
  input.value = '';
  fnAddMsg('user', text);
  fnHistory.push({ role: 'user', content: text });
  await fnCallAPI();
}


function fnChip(text) {
  if (fnBusy) return;
  document.getElementById('fn-input').value = text;
  fnSend();
}


function fnAddMsg(role, text) {
  const wrap   = document.getElementById('fn-messages');
  const row    = document.createElement('div');
  row.className = `fn-msg ${role}`;

  const icon   = document.createElement('div');
  icon.className = 'fn-icon';
  icon.textContent = role === 'bot' ? '🦉' : '🎓';

  const bubble = document.createElement('div');
  bubble.className = 'fn-bubble';
  bubble.textContent = text;

  row.appendChild(icon);
  row.appendChild(bubble);
  wrap.appendChild(row);
  wrap.scrollTop = wrap.scrollHeight;
}

function fnShowTyping() {
  const wrap = document.getElementById('fn-messages');
  const row  = document.createElement('div');
  row.className = 'fn-msg bot';
  row.id = 'fn-typing';

  const icon = document.createElement('div');
  icon.className = 'fn-icon';
  icon.textContent = '🦉';

  const bubble = document.createElement('div');
  bubble.className = 'fn-bubble';
  bubble.innerHTML = '<div class="fn-typing"><span></span><span></span><span></span></div>';

  row.appendChild(icon);
  row.appendChild(bubble);
  wrap.appendChild(row);
  wrap.scrollTop = wrap.scrollHeight;
}

function fnHideTyping() {
  const el = document.getElementById('fn-typing');
  if (el) el.remove();
}


async function fnCallAPI() {
  fnBusy = true;
  document.getElementById('fn-send').disabled = true;
  fnShowTyping();

  const messages = [
    { role: 'system', content: FN_SYSTEM },
    ...fnHistory.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    }))
  ];

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
        'HTTP-Referer': 'https://focusnest.app',
        'X-Title': 'FocusNest AI'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: messages
      })
    });

    const data = await res.json();
    fnHideTyping();

    if (data.error) {
      console.error('OpenRouter error:', data.error);
      fnAddMsg('bot', '⚠️ Error: ' + data.error.message);
      fnBusy = false;
      document.getElementById('fn-send').disabled = false;
      return;
    }

    const reply = data?.choices?.[0]?.message?.content
      || "Sorry, I couldn't get a response right now. Please try again! 🔄";

    fnHistory.push({ role: 'assistant', content: reply });
    fnAddMsg('bot', reply);

  } catch (err) {
    fnHideTyping();
    console.error('Network error:', err);
    fnAddMsg('bot', "Oops! Couldn't connect. Check your internet and try again 🔄");
  }

  fnBusy = false;
  document.getElementById('fn-send').disabled = false;
  document.getElementById('fn-input').focus();
}


function fnClearChat() {
  fnHistory.length = 0;
  document.getElementById('fn-messages').innerHTML = '';
  fnAddMsg('bot', "Chat cleared! 🧹 How can I help you study today?");
}