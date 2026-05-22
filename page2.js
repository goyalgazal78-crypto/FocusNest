
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}


let selectedCategory = "";
let selectedPriority  = "";
let tasks = [];
let calendarEvents = [];
let calendar;

const STORAGE_KEY_TASKS  = "focusnest_tasks";
const STORAGE_KEY_EVENTS = "focusnest_events";


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


function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  if (!title) { showToast("⚠️ Please enter a task title!", "#ffa500"); return; }

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
    dueDate: dueDate || null,
    scheduledDate: null   // ← set when dragged onto calendar
  };

  tasks.push(task);
  saveTasks();
  renderTaskList();
  updateStats();

 
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDueDate").value = "";
  document.getElementById("subtasks").innerHTML = "";
  document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".priority-btn").forEach(b => b.classList.remove("active"));
  selectedCategory = "";
  selectedPriority  = "";

  showToast("✅ Task added successfully!");
}

function deleteTask(id) {
  // Remove from calendar if it exists there
  const calEv = calendar && calendar.getEventById(String(id));
  if (calEv) calEv.remove();
  calendarEvents = calendarEvents.filter(e => String(e.id) !== String(id));
  saveEvents();

  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTaskList();
  updateStats();
}


function toggleTaskDone(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTasks();
  renderTaskList();
  updateStats();
  showToast(task.done ? "✅ Task marked complete!" : "↩️ Task marked incomplete");
}


function markTaskDoneFromCalendar(taskId, calEventId, fcEventObj) {
  const task = tasks.find(t => String(t.id) === String(taskId));
  if (task) {
    task.done = true;
    task.scheduledDate = null;
    saveTasks();
  }
  // Remove from calendarEvents array and FullCalendar
  calendarEvents = calendarEvents.filter(e => String(e.id) !== String(calEventId));
  saveEvents();
  if (fcEventObj) fcEventObj.remove();

  renderTaskList();
  updateStats();
  showToast("🎉 Task completed!");
}


function toggleSubtask(taskId, subIdx) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  task.subtasks[subIdx].done = !task.subtasks[subIdx].done;
  saveTasks();
  renderTaskList();
}


function renderTaskList() {
  const list  = document.getElementById("taskList");
  const empty = document.getElementById("emptyState");

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
    card.className = "task" + (task.done ? " task-done" : "");
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

    
    const displayDate = task.dueDate || task.scheduledDate || null;
    let dueDateHtml = "";
    if (displayDate) {
      const due      = new Date(displayDate);
      const today    = new Date(); today.setHours(0,0,0,0);
      const dueDay   = new Date(displayDate); dueDay.setHours(0,0,0,0);
      const diffMs   = dueDay - today;
      const diffDays = Math.round(diffMs / (1000*60*60*24));

      let dueCls = "", dueMsg = "";
      const isScheduled = !task.dueDate && task.scheduledDate;
      const prefix = isScheduled ? "📆 Scheduled:" : "📅";

      if (diffDays < 0)       { dueCls = "overdue"; dueMsg = `⚠️ Overdue by ${Math.abs(diffDays)} day(s)`; }
      else if (diffDays === 0){ dueCls = "today";   dueMsg = `${prefix} Due Today!`; }
      else                    { dueCls = "";
                                dueMsg = `${prefix} ${due.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})} (${diffDays}d)`; }
      dueDateHtml = `<div class="task-due ${dueCls}">${dueMsg}</div>`;
    }

    card.innerHTML = `
      <div class="task-title-row">
        <div style="display:flex;align-items:center;gap:8px;">
          <input type="checkbox" ${task.done ? 'checked' : ''}
            onchange="toggleTaskDone(${task.id})"
            style="width:16px;height:16px;cursor:pointer;accent-color:#28c76f;flex-shrink:0;">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;
            background:${dotColor};flex-shrink:0;"></span>
          <b style="${task.done ? 'text-decoration:line-through;opacity:0.5;' : ''}">${escapeHtml(task.title)}</b>
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


function showCalendarEventModal(fcEvent) {
  // Remove any existing modal first
  const existing = document.getElementById("cal-modal");
  if (existing) existing.remove();

  const taskId = fcEvent.id;
  const task   = tasks.find(t => String(t.id) === String(taskId));

  // Format scheduled date nicely
  const dateStr = fcEvent.startStr
    ? new Date(fcEvent.startStr).toLocaleDateString('en-US',
        { weekday:'long', month:'long', day:'numeric', year:'numeric' })
    : "";

  const modal = document.createElement("div");
  modal.id = "cal-modal";
  modal.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,0.55);
    display:flex; align-items:center; justify-content:center;
    z-index:9999; font-family:inherit;
  `;

  const priorityColor = task ? task.color : "#6c757d";
  const isDone        = task ? task.done  : false;

  modal.innerHTML = `
    <div style="
      background:#fff; border-radius:16px; padding:28px 32px;
      min-width:320px; max-width:420px; width:90%;
      box-shadow:0 20px 60px rgba(0,0,0,0.25);
      position:relative;
    ">
      <!-- Close × -->
      <button onclick="document.getElementById('cal-modal').remove()"
        style="position:absolute;top:14px;right:16px;background:none;border:none;
               font-size:20px;cursor:pointer;color:#aaa;line-height:1;">✕</button>

      <!-- Header -->
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
        <span style="width:13px;height:13px;border-radius:50%;
          background:${priorityColor};display:inline-block;flex-shrink:0;"></span>
        <h5 style="margin:0;font-size:17px;font-weight:700;color:#1a1a2e;">
          ${escapeHtml(fcEvent.title)}
        </h5>
      </div>

      <!-- Date -->
      <p style="margin:0 0 4px 23px;font-size:13px;color:#6c757d;">
        📆 ${dateStr}
      </p>

      <!-- Category / priority badges -->
      ${task ? `<p style="margin:6px 0 16px 23px;">
        ${task.category ? `<span style="background:#6c757d;color:#fff;border-radius:4px;padding:2px 8px;font-size:11px;margin-right:4px;">${task.category}</span>` : ""}
        ${task.priority ? `<span style="background:${priorityColor};color:#fff;border-radius:4px;padding:2px 8px;font-size:11px;">${task.priority}</span>` : ""}
      </p>` : `<div style="margin-bottom:16px;"></div>`}

      <!-- Status -->
      ${isDone ? `<p style="color:#28c76f;font-weight:600;font-size:13px;margin-bottom:16px;">✅ Already marked complete</p>` : ""}

      <!-- Action buttons -->
      <div style="display:flex;flex-direction:column;gap:10px;">

        ${!isDone ? `
        <!-- MARK DONE -->
        <button onclick="
          markTaskDoneFromCalendar('${taskId}', '${fcEvent.id}', calendar.getEventById('${fcEvent.id}'));
          document.getElementById('cal-modal').remove();
        " style="
          background:linear-gradient(135deg,#28c76f,#20a050);
          color:#fff; border:none; border-radius:10px;
          padding:11px 0; font-size:14px; font-weight:600;
          cursor:pointer; width:100%;
        ">✅ Mark as Completed</button>
        ` : ""}

        <!-- REMOVE FROM CALENDAR ONLY -->
        <button onclick="
          (function(){
            const ev = calendar.getEventById('${fcEvent.id}');
            if(ev) ev.remove();
            calendarEvents = calendarEvents.filter(e => String(e.id) !== '${fcEvent.id}');
            saveEvents();
            const t = tasks.find(x => String(x.id) === '${taskId}');
            if(t){ t.scheduledDate = null; saveTasks(); renderTaskList(); }
            showToast('🗑️ Removed from calendar');
          })();
          document.getElementById('cal-modal').remove();
        " style="
          background:#fff; color:#e74c3c;
          border:2px solid #e74c3c; border-radius:10px;
          padding:10px 0; font-size:14px; font-weight:600;
          cursor:pointer; width:100%;
        ">🗑️ Remove from Calendar</button>

        <!-- DELETE TASK ENTIRELY -->
        <button onclick="
          deleteTask(${taskId});
          document.getElementById('cal-modal').remove();
        " style="
          background:#fff5f5; color:#c0392b;
          border:1px solid #fcc; border-radius:10px;
          padding:10px 0; font-size:13px; font-weight:500;
          cursor:pointer; width:100%;
        ">🗑️ Delete Task Entirely</button>

        <!-- CANCEL -->
        <button onclick="document.getElementById('cal-modal').remove()"
          style="background:#f8f9fa;color:#555;border:1px solid #ddd;
                 border-radius:10px;padding:9px 0;font-size:13px;cursor:pointer;width:100%;">
          Cancel
        </button>
      </div>
    </div>
  `;

  // Close when clicking backdrop
  modal.addEventListener("click", function(e) {
    if (e.target === modal) modal.remove();
  });

  document.body.appendChild(modal);
}


function showToast(msg, bg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.background = bg || "#28c76f";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}


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


function logoutUser() {
  localStorage.removeItem("loggedIn");
  alert("Logged out successfully!");
  window.location.href = "login.html";
}


document.addEventListener("DOMContentLoaded", function () {

  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  }, 1300);

  initDarkMode();
  loadFromStorage();

  // Build FullCalendar
  calendar = new FullCalendar.Calendar(document.getElementById("calendar"), {
    initialView: "dayGridMonth",
    droppable:   true,
    editable:    true,
    events:      calendarEvents,

    drop: function () {
      
    },

    eventReceive: function (info) {
      const taskId = info.event.id || info.event.extendedProps.id || Date.now().toString();
      const dateDropped = info.event.startStr;

   
      const ev = {
        id:    taskId,
        title: info.event.title,
        date:  dateDropped,
        color: info.event.backgroundColor
      };
     
      calendarEvents = calendarEvents.filter(e => String(e.id) !== String(taskId));
      calendarEvents.push(ev);
      saveEvents();

    
      const task = tasks.find(t => String(t.id) === String(taskId));
      if (task) {
        task.scheduledDate = dateDropped;
        if (!task.dueDate) task.dueDate = dateDropped;
        saveTasks();
        renderTaskList();    
        updateStats();
      }
    },

  
    eventClick: function (info) {
      info.jsEvent.preventDefault();
      showCalendarEventModal(info.event);
    }
  });

  calendar.render();

  
  calendarEvents.forEach(ev => {
    calendar.addEvent({
      id:    ev.id,
      title: ev.title,
      start: ev.date,
      color: ev.color
    });
  });

  renderTaskList();
  updateStats();
});


function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


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
