/* ===========================
   FocusNest — changes.js
   (Task Creator Page)
   =========================== */

/* ──────────────────────────────────────────
   AUTH GUARD — redirect if not logged in
────────────────────────────────────────── */
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

/* ──────────────────────────────────────────
   STATE
────────────────────────────────────────── */
let selectedCategory = "";
let selectedPriority  = "";
let tasks = [];          // { id, title, category, priority, color, subtasks:[], done:false }
let calendarEvents = []; // { id, title, date, color }
let calendar;

const STORAGE_KEY_TASKS  = "focusnest_tasks";
const STORAGE_KEY_EVENTS = "focusnest_events";

/* ──────────────────────────────────────────
   PERSIST HELPERS
────────────────────────────────────────── */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(calendarEvents));
}

function loadFromStorage() {
  const t = localStorage.getItem(STORAGE_KEY_TASKS);
  const e = localStorage.getItem(STORAGE_KEY_EVENTS);
  if (t) tasks = JSON.parse(t);
  if (e) calendarEvents = JSON.parse(e);
}

/* ──────────────────────────────────────────
   SELECTION HELPERS
────────────────────────────────────────── */
function selectCategory(el, val) {
  document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  selectedCategory = val;
}

function selectPriority(el, val) {
  document.querySelectorAll(".priority-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  selectedPriority = val;
}

/* ──────────────────────────────────────────
   SUBTASK ROW
────────────────────────────────────────── */
function addSubtask() {
  const div = document.createElement("div");
  div.className = "input-group mb-1";
  div.innerHTML = `
    <input class="form-control subtask-input" placeholder="Subtask…">
    <button class="btn btn-outline-danger btn-sm" type="button"
      onclick="this.closest('.input-group').remove()">✕</button>
  `;
  document.getElementById("subtasks").appendChild(div);
}

/* ──────────────────────────────────────────
   ADD TASK
────────────────────────────────────────── */
function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  if (!title) { showToast("⚠️ Please enter a task title!", "#ffa500"); return; }

  // Collect subtasks
  const subtaskInputs = document.querySelectorAll(".subtask-input");
  const subtasks = [];
  subtaskInputs.forEach(inp => {
    const v = inp.value.trim();
    if (v) subtasks.push({ text: v, done: false });
  });

  const color = selectedPriority === "high"   ? "#ff4d4d"
              : selectedPriority === "medium" ? "#ffa500"
              : "#28c76f";

  const dueDate = document.getElementById("taskDueDate").value;

  const task = {
    id: Date.now(),
    title,
    category: selectedCategory,
    priority: selectedPriority,
    color,
    subtasks,
    done: false,
    dueDate: dueDate || null
  };

  tasks.push(task);
  saveTasks();
  renderTaskList();
  updateStats();

  // Reset form
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDueDate").value = "";
  document.getElementById("subtasks").innerHTML = "";
  document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".priority-btn").forEach(b => b.classList.remove("active"));
  selectedCategory = "";
  selectedPriority  = "";

  showToast("✅ Task added successfully!");
}

/* ──────────────────────────────────────────
   DELETE TASK
────────────────────────────────────────── */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTaskList();
  updateStats();
}

/* ──────────────────────────────────────────
   TOGGLE SUBTASK DONE
────────────────────────────────────────── */
function toggleSubtask(taskId, subIdx) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  task.subtasks[subIdx].done = !task.subtasks[subIdx].done;
  saveTasks();
  renderTaskList();
}

/* ──────────────────────────────────────────
   RENDER TASK LIST
────────────────────────────────────────── */
function renderTaskList() {
  const list  = document.getElementById("taskList");
  const empty = document.getElementById("emptyState");

  // Clear existing task cards (not the empty state div)
  list.querySelectorAll(".task").forEach(el => el.remove());

  if (tasks.length === 0) {
    empty.style.display = "block";
    document.getElementById("progressWrap").style.display = "none";
    return;
  }

  empty.style.display = "none";
  document.getElementById("progressWrap").style.display = "block";

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "task";
    card.dataset.title = task.title;
    card.dataset.color = task.color;
    card.dataset.id    = task.id;

    const dotColor = task.color;

    // Subtasks HTML
    let subtasksHtml = "";
    if (task.subtasks && task.subtasks.length > 0) {
      subtasksHtml = `<div class="subtask-list">`;
      task.subtasks.forEach((st, i) => {
        subtasksHtml += `
          <div class="subtask-item ${st.done ? 'done' : ''}">
            <input type="checkbox" ${st.done ? 'checked' : ''}
              onchange="toggleSubtask(${task.id}, ${i})">
            <span>${escapeHtml(st.text)}</span>
          </div>`;
      });
      subtasksHtml += `</div>`;
    }

    const catBadge = task.category
      ? `<span class="badge bg-secondary me-1">${task.category}</span>` : "";
    const priBadge = task.priority
      ? `<span class="badge" style="background:${dotColor}">${task.priority}</span>` : "";

    // Due date display
    let dueDateHtml = "";
    if (task.dueDate) {
      const due     = new Date(task.dueDate);
      const today   = new Date(); today.setHours(0,0,0,0);
      const dueDay  = new Date(task.dueDate); dueDay.setHours(0,0,0,0);
      const diffMs  = dueDay - today;
      const diffDays = Math.round(diffMs / (1000*60*60*24));
      let dueCls = "", dueMsg = "";
      if (diffDays < 0)      { dueCls = "overdue"; dueMsg = `⚠️ Overdue by ${Math.abs(diffDays)} day(s)`; }
      else if (diffDays === 0) { dueCls = "today";   dueMsg = "📅 Due Today!"; }
      else                   { dueCls = "";         dueMsg = `📅 Due in ${diffDays} day(s) (${due.toLocaleDateString('en-US',{month:'short',day:'numeric'})})`; }
      dueDateHtml = `<div class="task-due ${dueCls}">${dueMsg}</div>`;
    }

    card.innerHTML = `
      <div class="task-title-row">
        <div>
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;
            background:${dotColor};margin-right:6px;"></span>
          <b>${escapeHtml(task.title)}</b>
        </div>
        <button class="task-delete-btn" title="Delete task"
          onclick="deleteTask(${task.id})">✕</button>
      </div>
      <div style="margin-top:6px;">${catBadge}${priBadge}</div>
      ${dueDateHtml}
      ${subtasksHtml}
    `;

    list.appendChild(card);
  });

  initDraggable();
  updateProgress();
}

/* ──────────────────────────────────────────
   STATS + PROGRESS
────────────────────────────────────────── */
function updateStats() {
  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const pending = total - done;

  document.getElementById("statTotal").textContent   = total;
  document.getElementById("statPending").textContent = pending;
  document.getElementById("statDone").textContent    = done;
}

function updateProgress() {
  const total = tasks.length;
  const doneCount = tasks.filter(t => {
    if (t.subtasks.length === 0) return t.done;
    return t.subtasks.every(s => s.done);
  }).length;

  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  document.getElementById("progressBar").style.width = pct + "%";
  document.getElementById("progressLabel").textContent = `${doneCount} / ${total}`;
}

/* ──────────────────────────────────────────
   TOAST
────────────────────────────────────────── */
function showToast(msg, bg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.background = bg || "#28c76f";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

/* ──────────────────────────────────────────
   CALENDAR + DRAGGABLE
────────────────────────────────────────── */
function initDraggable() {
  const container = document.getElementById("taskList");
  if (container._draggable) {
    container._draggable.destroy();
  }
  const draggable = new FullCalendar.Draggable(container, {
    itemSelector: ".task",
    eventData: function (eventEl) {
      return {
        id:    eventEl.dataset.id,
        title: eventEl.dataset.title,
        color: eventEl.dataset.color
      };
    }
  });
  container._draggable = draggable;
}

/* ──────────────────────────────────────────
   LOGOUT
────────────────────────────────────────── */
function logoutUser() {
  localStorage.removeItem("loggedIn");
  alert("Logged out successfully!");
  window.location.href = "login.html";
}

/* ──────────────────────────────────────────
   DOM READY
────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {

  // Hide loader
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  }, 1300);

  // Dark mode
  initDarkMode();

  loadFromStorage();

  // Build FullCalendar
  calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
    initialView: "dayGridMonth",
    droppable: true,
    editable: true,
    events: calendarEvents,

    drop: function (info) {
      // Fired when a task card is dragged onto the calendar
    },

    eventReceive: function (info) {
      const ev = {
        id:    info.event.id || info.event.extendedProps.id || Date.now().toString(),
        title: info.event.title,
        date:  info.event.startStr,
        color: info.event.backgroundColor
      };
      calendarEvents.push(ev);
      saveEvents();
    },

    eventClick: function (info) {
      if (confirm(`Remove "${info.event.title}" from calendar?`)) {
        calendarEvents = calendarEvents.filter(e => e.id !== info.event.id);
        saveEvents();
        info.event.remove();
      }
    }
  });

  calendar.render();

  // Restore saved calendar events
  calendarEvents.forEach(ev => {
    calendar.addEvent({
      id:    ev.id,
      title: ev.title,
      start: ev.date,
      color: ev.color
    });
  });

  // Render saved tasks
  renderTaskList();
  updateStats();
});

/* ──────────────────────────────────────────
   UTILS
────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
/* ── DARK MODE ── */
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
