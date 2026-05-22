
const STORAGE_KEY_TASKS   = "focusnest_tasks";
const STORAGE_KEY_FOCUS   = "focusnest_focusminutes";
const STORAGE_KEY_STREAK  = "focusnest_streak";
const STORAGE_KEY_LASTDAY = "focusnest_lastday";
const SESSION_LOG_KEY     = "focusnest_sessionlog";

function getTasks() {
  const t = localStorage.getItem(STORAGE_KEY_TASKS);
  return t ? JSON.parse(t) : [];
}

function getFocusMinutes() {
  return parseInt(localStorage.getItem(STORAGE_KEY_FOCUS) || "0");
}

function saveFocusMinutes(m) {
  localStorage.setItem(STORAGE_KEY_FOCUS, m);
}

function getSessionLog() {
  const s = localStorage.getItem(SESSION_LOG_KEY);
  return s ? JSON.parse(s) : [];
}


if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

function logoutUser() {
  localStorage.removeItem("loggedIn");
  alert("Logged out successfully!");
  window.location.href = "login.html";
}



function loadStats() {
  const tasks = getTasks();
  const total = tasks.length;

  const completed = tasks.filter(t =>
    t.subtasks.length === 0 ? t.done : t.subtasks.every(s => s.done)
  ).length;

  const pending = total - completed;

  document.getElementById("statCompleted").textContent = completed;
  document.getElementById("statPending").textContent   = pending;
  document.getElementById("statFocus").textContent     = getFocusMinutes();

  // Streak logic
  const today = new Date().toDateString();
  const last  = localStorage.getItem(STORAGE_KEY_LASTDAY);
  let streak  = parseInt(localStorage.getItem(STORAGE_KEY_STREAK) || "0");

  if (last === today) {
    // same day — keep streak
  } else if (last === new Date(Date.now() - 86400000).toDateString()) {
    streak++;
    localStorage.setItem(STORAGE_KEY_STREAK, streak);
    localStorage.setItem(STORAGE_KEY_LASTDAY, today);
  } else if (!last) {
    streak = 1;
    localStorage.setItem(STORAGE_KEY_STREAK, streak);
    localStorage.setItem(STORAGE_KEY_LASTDAY, today);
  }

  document.getElementById("statStreak").textContent = streak;
}


const QUOTES = [
  { text: "The secret of getting ahead is getting started.",                             author: "Mark Twain" },
  { text: "It always seems impossible until it's done.",                                 author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.",                         author: "Sam Levenson" },
  { text: "Success is the sum of small efforts repeated day in and day out.",            author: "Robert Collier" },
  { text: "Believe you can and you're halfway there.",                                   author: "Theodore Roosevelt" },
  { text: "You don't have to be great to start, but you have to start to be great.",     author: "Zig Ziglar" },
  { text: "Push yourself, because no one else is going to do it for you.",               author: "Unknown" },
  { text: "Great things never come from comfort zones.",                                 author: "Unknown" },
  { text: "Dream it. Wish it. Do it.",                                                   author: "Unknown" },
  { text: "Study hard. Work hard. Dream big.",                                           author: "Unknown" },
  { text: "An investment in knowledge pays the best interest.",                          author: "Benjamin Franklin" },
  { text: "Education is the most powerful weapon to change the world.",                  author: "Nelson Mandela" },
];

let currentQuoteIdx = 0;

function refreshQuote() {
  currentQuoteIdx = (currentQuoteIdx + 1) % QUOTES.length;
  const q = QUOTES[currentQuoteIdx];
  document.getElementById("quoteText").textContent   = `"${q.text}"`;
  document.getElementById("quoteAuthor").textContent = `— ${q.author}`;
}



function updateProductivityScore() {
  const tasks    = getTasks();
  const total    = tasks.length;
  const done     = tasks.filter(t =>
    t.subtasks.length === 0 ? t.done : t.subtasks.every(s => s.done)
  ).length;
  const focusMin = getFocusMinutes();

  let score = 0;
  if (total > 0) score += Math.round((done / total) * 60);
  score += Math.min(40, Math.round((focusMin / 100) * 40));
  score = Math.min(100, score);

  const CIRC_S = 2 * Math.PI * 46; // 289
  const offset = CIRC_S * (1 - score / 100);
  document.getElementById("scoreArc").style.strokeDashoffset = offset;
  document.getElementById("scorePct").textContent = score + "%";

  const desc = score === 0  ? "Complete tasks and finish Pomodoro sessions to boost your score!"
             : score < 30   ? "Good start! Keep completing tasks 💪"
             : score < 60   ? "You're making great progress! 🚀"
             : score < 85   ? "Excellent work! Almost at the top 🔥"
             :                "Outstanding productivity! You're crushing it 🏆";
  document.getElementById("scoreDesc").textContent = desc;
}



function buildTodayPlan() {
  const tasks = getTasks();
  const container = document.getElementById("todayTaskList");

  const pending = tasks.filter(t => !(t.subtasks.length === 0 ? t.done : t.subtasks.every(s => s.done)));
  const done    = tasks.filter(t =>   t.subtasks.length === 0 ? t.done : t.subtasks.every(s => s.done));
  const sorted  = [...pending, ...done].slice(0, 6);

  if (sorted.length === 0) {
    container.innerHTML = `<div class="today-empty">🎉 No tasks yet! Add some on the Task Creator page.</div>`;
    return;
  }

  const catIcons = {
    Assignment:"📘", Exam:"📝", Project:"💻",
    Homework:"📓", Research:"🔬", Revision:"🔁",
    Presentation:"🎤", "Lab Work":"🧪"
  };

  container.innerHTML = sorted.map(t => {
    const isDone = t.subtasks.length === 0 ? t.done : t.subtasks.every(s => s.done);
    const icon   = catIcons[t.category] || "📌";
    return `<div class="today-task-item ${isDone ? 'done-item' : ''}">
      <span>${icon}</span>
      <span style="flex:1">${escapeHtml(t.title)}</span>
      ${isDone ? '<span style="color:#28c76f;font-size:13px;font-weight:700">✅</span>' : ''}
    </div>`;
  }).join("");
}


const MODES = {
  focus: { label: "FOCUS TIME",  minutes: 25, tip: "Stay focused for 25 minutes, then take a short break 🚀", grad: ["#6a11cb","#2575fc"] },
  short: { label: "SHORT BREAK", minutes: 5,  tip: "Nice work! Rest your eyes and stretch a little ☕",         grad: ["#28c76f","#00d2ff"] },
  long:  { label: "LONG BREAK",  minutes: 15, tip: "Great session! Take a well-deserved long break 🌙",         grad: ["#f7971e","#ffd200"] }
};

function applyTimings() {
  const f = parseInt(document.getElementById("inputFocus").value) || 25;
  const s = parseInt(document.getElementById("inputShort").value) || 5;
  const l = parseInt(document.getElementById("inputLong").value)  || 15;

  MODES.focus.minutes = Math.min(90, Math.max(1, f));
  MODES.short.minutes = Math.min(30, Math.max(1, s));
  MODES.long.minutes  = Math.min(60, Math.max(1, l));

  document.getElementById("inputFocus").value = MODES.focus.minutes;
  document.getElementById("inputShort").value = MODES.short.minutes;
  document.getElementById("inputLong").value  = MODES.long.minutes;

  totalSeconds  = MODES[currentMode].minutes * 60;
  remainSeconds = totalSeconds;
  clearInterval(timerInterval);
  timerRunning = false;
  document.getElementById("startBtn").textContent = "▶";
  updateDisplay();
  updateArc();

  const btn = document.querySelector(".timing-apply");
  btn.style.background = "linear-gradient(135deg,#28c76f,#00d2ff)";
  btn.textContent = "Applied ✓";
  setTimeout(() => {
    btn.style.background = "linear-gradient(135deg,#6a11cb,#2575fc)";
    btn.textContent = "Apply ✓";
  }, 1500);
}

let currentMode       = "focus";
let totalSeconds      = 25 * 60;
let remainSeconds     = totalSeconds;
let timerRunning      = false;
let timerInterval     = null;
let completedSessions = 0;
const MAX_SESSIONS    = 4;
const CIRC            = 2 * Math.PI * 108; // 678.6

function setMode(mode, el) {
  document.querySelectorAll(".mode-tab").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  currentMode   = mode;
  totalSeconds  = MODES[mode].minutes * 60;
  remainSeconds = totalSeconds;
  timerRunning  = false;
  clearInterval(timerInterval);
  document.getElementById("startBtn").textContent       = "▶";
  document.getElementById("timerModeLabel").textContent = MODES[mode].label;
  document.getElementById("pomodoroTip").textContent    = MODES[mode].tip;
  updateDisplay();
  updateArc();
  updateGradient(MODES[mode].grad);
}

function updateDisplay() {
  const m = Math.floor(remainSeconds / 60).toString().padStart(2, "0");
  const s = (remainSeconds % 60).toString().padStart(2, "0");
  document.getElementById("timerDisplay").textContent = m + ":" + s;
}

function updateArc() {
  const pct    = remainSeconds / totalSeconds;
  const offset = CIRC * (1 - pct);
  document.getElementById("timerArc").style.strokeDashoffset = offset;
}

function updateGradient(colors) {
  const stops = document.querySelectorAll("#pg stop");
  if (stops.length >= 2) {
    stops[0].setAttribute("stop-color", colors[0]);
    stops[1].setAttribute("stop-color", colors[1]);
  }
}

function toggleTimer() {
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    document.getElementById("startBtn").textContent = "▶";
  } else {
    timerRunning = true;
    document.getElementById("startBtn").textContent = "⏸";
    timerInterval = setInterval(() => {
      remainSeconds--;
      updateDisplay();
      updateArc();
      if (remainSeconds <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        document.getElementById("startBtn").textContent = "▶";
        onTimerEnd();
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning  = false;
  remainSeconds = totalSeconds;
  document.getElementById("startBtn").textContent = "▶";
  updateDisplay();
  updateArc();
}

function skipSession() {
  clearInterval(timerInterval);
  timerRunning  = false;
  remainSeconds = 0;
  updateDisplay();
  updateArc();
  onTimerEnd();
}

function onTimerEnd() {
  playBeep();
  addSessionLog(currentMode, MODES[currentMode].minutes);

  if (currentMode === "focus") {
    completedSessions++;
    const earned = MODES.focus.minutes;
    saveFocusMinutes(getFocusMinutes() + earned);
    document.getElementById("statFocus").textContent = getFocusMinutes();
    updateProductivityScore();
    updateSessionDots();

    if (completedSessions >= MAX_SESSIONS) {
      completedSessions = 0;
      updateSessionDots();
      const longTab = document.querySelectorAll(".mode-tab")[2];
      setMode("long", longTab);
      document.getElementById("pomodoroTip").textContent = "🎉 4 sessions done! Enjoy a long break!";
    } else {
      const shortTab = document.querySelectorAll(".mode-tab")[1];
      setMode("short", shortTab);
    }
  } else {
    const focusTab = document.querySelectorAll(".mode-tab")[0];
    setMode("focus", focusTab);
  }
}

function updateSessionDots() {
  const container = document.getElementById("sessionDots");
  container.innerHTML = "";
  for (let i = 0; i < MAX_SESSIONS; i++) {
    const dot = document.createElement("div");
    dot.className = "session-dot" + (i < completedSessions ? " done" : "");
    container.appendChild(dot);
  }
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 200, 400].forEach(delay => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.4, ctx.currentTime + delay / 1000);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay / 1000 + 0.3);
      osc.start(ctx.currentTime + delay / 1000);
      osc.stop(ctx.currentTime  + delay / 1000 + 0.35);
    });
  } catch (e) {}
}



const BADGE_DEFS = [
  { id:"first_task",    icon:"🥇", name:"First Step",    desc:"Complete your first task",          check:(t,f,s) => t >= 1   },
  { id:"five_tasks",    icon:"⭐", name:"Task Star",      desc:"Complete 5 tasks",                  check:(t,f,s) => t >= 5   },
  { id:"ten_tasks",     icon:"🏅", name:"Task Master",    desc:"Complete 10 tasks",                 check:(t,f,s) => t >= 10  },
  { id:"first_session", icon:"⏱️", name:"Focused",        desc:"Finish your first Pomodoro",        check:(t,f,s) => s >= 1   },
  { id:"five_sessions", icon:"🔥", name:"On Fire",        desc:"Complete 5 Pomodoro sessions",      check:(t,f,s) => s >= 5   },
  { id:"focus_60",      icon:"🧠", name:"Deep Focus",     desc:"Log 60 minutes of focus time",      check:(t,f,s) => f >= 60  },
  { id:"focus_200",     icon:"💎", name:"Focus Diamond",  desc:"Log 200 minutes of focus time",     check:(t,f,s) => f >= 200 },
  { id:"streak_3",      icon:"📅", name:"3-Day Streak",   desc:"Use FocusNest 3 days in a row",
    check: () => parseInt(localStorage.getItem("focusnest_streak") || 0) >= 3 },
];

function buildAchievements() {
  const tasks     = getTasks();
  const completed = tasks.filter(t =>
    t.subtasks.length === 0 ? t.done : t.subtasks.every(s => s.done)
  ).length;
  const focusMin  = getFocusMinutes();
  const sessions  = parseInt(localStorage.getItem("focusnest_totalsessions") || "0");
  const grid      = document.getElementById("achievementsGrid");

  grid.innerHTML = BADGE_DEFS.map(b => {
    const unlocked = b.check(completed, focusMin, sessions);
    return `<div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-name">${b.name}</div>
      <div class="badge-desc">${b.desc}</div>
      ${unlocked ? '<span class="badge-unlocked-tag">UNLOCKED</span>' : ''}
    </div>`;
  }).join("");
}


function addSessionLog(mode, minutes) {
  const log  = getSessionLog();
  const now  = new Date();
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  log.unshift({ mode, minutes, time, date: now.toDateString() });
  if (log.length > 30) log.pop();
  localStorage.setItem(SESSION_LOG_KEY, JSON.stringify(log));
  buildSessionLog();

  if (mode === "focus") {
    const total = parseInt(localStorage.getItem("focusnest_totalsessions") || "0") + 1;
    localStorage.setItem("focusnest_totalsessions", total);
    buildAchievements();
  }
}

function buildSessionLog() {
  const log  = getSessionLog();
  const list = document.getElementById("sessionLogList");

  if (log.length === 0) {
    list.innerHTML = `<div class="log-empty">No sessions yet. Start the timer! 🚀</div>`;
    return;
  }

  const icons  = { focus:"🎯", short:"☕", long:"🌙" };
  const labels = { focus:"Focus Session", short:"Short Break", long:"Long Break" };

  list.innerHTML = log.map(entry => `
    <div class="session-log-item log-${entry.mode}">
      <span>${icons[entry.mode]}</span>
      <span style="font-weight:600">${labels[entry.mode]}</span>
      <span style="color:#888">${entry.minutes} min</span>
      <span class="log-time">${entry.time}</span>
    </div>`).join("");
}



function buildCharts() {
  const tasks = getTasks();

  // Bar chart: tasks created per day — last 7 days
  const days   = [];
  const counts = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toLocaleDateString("en-US", { weekday: "short" }));
    counts.push(0);
  }
  tasks.forEach(t => {
    const created = new Date(t.id);
    for (let i = 0; i < 7; i++) {
      const d = new Date(Date.now() - (6 - i) * 86400000);
      if (created.toDateString() === d.toDateString()) counts[i]++;
    }
  });

  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: days,
      datasets: [{
        label: "Tasks",
        data: counts,
        backgroundColor: [
          "rgba(106,17,203,0.7)", "rgba(37,117,252,0.7)", "rgba(78,205,196,0.7)",
          "rgba(255,107,107,0.7)", "rgba(247,183,51,0.7)", "rgba(40,199,111,0.7)",
          "rgba(106,17,203,0.7)"
        ],
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f0f0f0" } },
        x: { grid: { display: false } }
      }
    }
  });


  const catCounts = { Assignment: 0, Exam: 0, Project: 0, Other: 0 };
  tasks.forEach(t => {
    if (catCounts[t.category] !== undefined) catCounts[t.category]++;
    else catCounts.Other++;
  });

  const catLabels = Object.keys(catCounts).filter(k => catCounts[k] > 0);
  const catData   = catLabels.map(k => catCounts[k]);

  new Chart(document.getElementById("donutChart"), {
    type: "doughnut",
    data: {
      labels: catLabels.length ? catLabels : ["No tasks yet"],
      datasets: [{
        data: catData.length ? catData : [1],
        backgroundColor: catData.length
          ? ["#6a11cb", "#2575fc", "#4ecdc4", "#f7b733"]
          : ["#eee"],
        borderWidth: 0,
        hoverOffset: 6
      }]
    },
    options: {
      cutout: "70%",
      plugins: {
        legend: { position: "bottom", labels: { padding: 16, font: { size: 13 } } }
      }
    }
  });
}


function buildTable() {
  const tasks = getTasks();
  const tbody = document.getElementById("taskTableBody");

  if (tasks.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-table">🗒️ No tasks found. Add tasks on the Task Creator page!</td></tr>`;
    return;
  }

  tbody.innerHTML = tasks.map((t, i) => {
    const isCompleted = t.subtasks.length === 0
      ? t.done
      : t.subtasks.every(s => s.done);

    const priClass = t.priority === "high"   ? "pri-high"
                   : t.priority === "medium" ? "pri-medium"
                   : t.priority === "low"    ? "pri-low"
                   : "pri-none";

    const priLabel = t.priority
      ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1) : "—";
    const catLabel  = t.category || "—";
    const subCount  = t.subtasks ? t.subtasks.length : 0;
    const subDone   = t.subtasks ? t.subtasks.filter(s => s.done).length : 0;

    return `<tr>
      <td style="color:#aaa;font-size:13px">${i + 1}</td>
      <td><b>${escapeHtml(t.title)}</b></td>
      <td>${catLabel !== "—"
        ? `<span class="cat-badge">${catLabel}</span>`
        : `<span style="color:#ccc">—</span>`}</td>
      <td><span class="pri-badge ${priClass}">${priLabel}</span></td>
      <td style="color:#888;font-size:13px">${subCount > 0 ? subDone + " / " + subCount + " done" : "—"}</td>
      <td class="${isCompleted ? 'status-done' : 'status-pending'}">${isCompleted ? "✅ Done" : "⏳ Pending"}</td>
    </tr>`;
  }).join("");
}



function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}



document.addEventListener("DOMContentLoaded", () => {

  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  }, 1300);

  // Dark mode
  initDarkMode();

  
  currentQuoteIdx = Math.floor(Math.random() * QUOTES.length);
  const q = QUOTES[currentQuoteIdx];
  document.getElementById("quoteText").textContent   = `"${q.text}"`;
  document.getElementById("quoteAuthor").textContent = `— ${q.author}`;

  updateSessionDots();
  updateDisplay();
  loadStats();
  updateProductivityScore();
  buildTodayPlan();
  buildAchievements();
  buildSessionLog();
  buildCharts();
  buildTable();
});


function initDarkMode() {
  if (localStorage.getItem("fn_dark") === "true") {
    document.body.classList.add("dark-mode");
    updateDarkBtn(true);
  }
}
function toggleDark() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("fn_dark", isDark);
  updateDarkBtn(isDark);
}
function updateDarkBtn(isDark) {
  const icon  = document.getElementById("darkIcon");
  const label = document.getElementById("darkLabel");
  if (icon)  icon.className    = isDark ? "ti ti-sun" : "ti ti-moon";
  if (label) label.textContent = isDark ? "Light" : "Dark";
}
function logoutUser() {
  localStorage.removeItem("loggedIn");
  alert("Logged out!");
  window.location.href = "login.html";
}