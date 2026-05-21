/* ===========================
   FocusNest — page4.js
   (Resource Explorer Page)
   =========================== */

/* ── AUTH GUARD ── */
if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "login.html";
}

function logoutUser() {
  localStorage.removeItem("loggedIn");
  alert("Logged out successfully!");
  window.location.href = "login.html";
}

/* ── SUBJECTS DATA ── */
const SUBJECTS = [
  // CSE
  { id:1,  branch:"cse", sem:1, name:"Mathematics I",           desc:"Calculus, Differential Equations, Linear Algebra",           type:"Theory",   icon:"📐", resources:8,  popular:true  },
  { id:2,  branch:"cse", sem:1, name:"Programming in C",        desc:"Fundamentals of C programming, pointers, memory management", type:"Theory",   icon:"💻", resources:12, popular:true  },
  { id:3,  branch:"cse", sem:1, name:"Digital Logic Design",    desc:"Logic gates, Boolean algebra, combinational circuits",       type:"Theory",   icon:"🔌", resources:7,  popular:false },
  { id:4,  branch:"cse", sem:1, name:"Physics Lab",             desc:"Basic physics experiments and observations",                 type:"Lab",      icon:"🔬", resources:5,  popular:false },
  { id:5,  branch:"cse", sem:2, name:"Data Structures",         desc:"Arrays, Linked Lists, Trees, Graphs and Sorting algorithms", type:"Theory",   icon:"🌲", resources:15, popular:true  },
  { id:6,  branch:"cse", sem:2, name:"Mathematics II",          desc:"Probability, Statistics, Numerical Methods",                 type:"Theory",   icon:"📊", resources:9,  popular:false },
  { id:7,  branch:"cse", sem:2, name:"OOP with Java",           desc:"Object-oriented programming, inheritance, polymorphism",     type:"Theory",   icon:"☕", resources:11, popular:true  },
  { id:8,  branch:"cse", sem:3, name:"Operating Systems",       desc:"Process management, memory, file systems, scheduling",      type:"Theory",   icon:"🖥️", resources:14, popular:true  },
  { id:9,  branch:"cse", sem:3, name:"Database Management",     desc:"SQL, ER diagrams, normalization, transactions",              type:"Theory",   icon:"🗄️", resources:13, popular:true  },
  { id:10, branch:"cse", sem:3, name:"Computer Networks",       desc:"OSI model, TCP/IP, routing, network security",               type:"Theory",   icon:"🌐", resources:10, popular:false },
  { id:11, branch:"cse", sem:4, name:"Algorithms",              desc:"Sorting, searching, dynamic programming, greedy algorithms", type:"Theory",   icon:"⚙️", resources:16, popular:true  },
  { id:12, branch:"cse", sem:4, name:"Software Engineering",    desc:"SDLC, Agile, UML, testing methodologies",                   type:"Theory",   icon:"📋", resources:8,  popular:false },
  { id:13, branch:"cse", sem:5, name:"Machine Learning",        desc:"Regression, classification, clustering, neural networks",   type:"Elective", icon:"🤖", resources:18, popular:true  },
  { id:14, branch:"cse", sem:5, name:"Web Technologies",        desc:"HTML, CSS, JavaScript, React, Node.js basics",              type:"Elective", icon:"🌍", resources:14, popular:true  },
  { id:15, branch:"cse", sem:6, name:"Cloud Computing",         desc:"AWS, Azure, GCP, virtualization, microservices",            type:"Elective", icon:"☁️", resources:11, popular:false },
  // ECE
  { id:16, branch:"ece", sem:1, name:"Basic Electronics",       desc:"Diodes, transistors, amplifiers, rectifiers",               type:"Theory",   icon:"⚡", resources:9,  popular:true  },
  { id:17, branch:"ece", sem:1, name:"Circuit Theory",          desc:"Kirchhoff's laws, mesh analysis, Thevenin theorem",         type:"Theory",   icon:"🔋", resources:10, popular:false },
  { id:18, branch:"ece", sem:2, name:"Signals & Systems",       desc:"Fourier transforms, Laplace, Z-transforms, convolution",    type:"Theory",   icon:"📡", resources:12, popular:true  },
  { id:19, branch:"ece", sem:3, name:"Digital Communication",   desc:"Modulation, AM/FM/PM, digital encoding, error correction",  type:"Theory",   icon:"📶", resources:11, popular:true  },
  { id:20, branch:"ece", sem:4, name:"VLSI Design",             desc:"CMOS logic, layout design, timing analysis",                type:"Theory",   icon:"🔲", resources:8,  popular:false },
  { id:21, branch:"ece", sem:5, name:"Embedded Systems",        desc:"Microcontrollers, Arduino, RTOS, interfacing",              type:"Elective", icon:"🛠️", resources:13, popular:true  },
  // ME
  { id:22, branch:"me",  sem:1, name:"Engineering Mechanics",   desc:"Statics, dynamics, forces, equilibrium, friction",          type:"Theory",   icon:"⚙️", resources:9,  popular:true  },
  { id:23, branch:"me",  sem:2, name:"Thermodynamics",          desc:"Laws of thermodynamics, entropy, heat engines, cycles",     type:"Theory",   icon:"🌡️", resources:11, popular:true  },
  { id:24, branch:"me",  sem:3, name:"Fluid Mechanics",         desc:"Bernoulli's equation, pipe flow, turbomachinery",           type:"Theory",   icon:"💧", resources:8,  popular:false },
  { id:25, branch:"me",  sem:4, name:"Manufacturing Processes", desc:"Casting, welding, machining, CNC, additive manufacturing",  type:"Theory",   icon:"🏭", resources:10, popular:false },
  { id:26, branch:"me",  sem:5, name:"CAD/CAM",                 desc:"SolidWorks, AutoCAD, CNC programming, design automation",   type:"Elective", icon:"🖊️", resources:12, popular:true  },
  // CE
  { id:27, branch:"ce",  sem:1, name:"Engineering Drawing",     desc:"Orthographic projection, isometric views, AutoCAD basics",  type:"Theory",   icon:"📐", resources:7,  popular:false },
  { id:28, branch:"ce",  sem:2, name:"Strength of Materials",   desc:"Stress, strain, bending moment, shear force diagrams",      type:"Theory",   icon:"🏗️", resources:10, popular:true  },
  { id:29, branch:"ce",  sem:3, name:"Structural Analysis",     desc:"Beams, frames, trusses, influence lines",                   type:"Theory",   icon:"🌉", resources:9,  popular:false },
  { id:30, branch:"ce",  sem:4, name:"Geotechnical Engineering", desc:"Soil properties, foundation design, slope stability",       type:"Theory",   icon:"⛰️", resources:8,  popular:false },
  // EE
  { id:31, branch:"ee",  sem:1, name:"Electrical Circuits",     desc:"DC/AC circuits, phasors, power analysis",                   type:"Theory",   icon:"💡", resources:9,  popular:true  },
  { id:32, branch:"ee",  sem:2, name:"Electrical Machines",     desc:"DC motors, transformers, synchronous machines",             type:"Theory",   icon:"⚙️", resources:11, popular:true  },
  { id:33, branch:"ee",  sem:3, name:"Power Systems",           desc:"Generation, transmission, distribution, load flow",         type:"Theory",   icon:"🏭", resources:10, popular:false },
  // IT
  { id:34, branch:"it",  sem:1, name:"Intro to Programming",    desc:"Python basics, problem solving, algorithms",                type:"Theory",   icon:"🐍", resources:10, popular:true  },
  { id:35, branch:"it",  sem:2, name:"Data Structures",         desc:"Lists, stacks, queues, trees, hashing",                     type:"Theory",   icon:"🌲", resources:14, popular:true  },
  { id:36, branch:"it",  sem:3, name:"Cybersecurity Basics",    desc:"Encryption, firewalls, ethical hacking fundamentals",       type:"Elective", icon:"🔒", resources:12, popular:true  },
];

/* ── STATE ── */
let activeBranch = "all";
let activeSem    = "all";
let bookmarks    = JSON.parse(localStorage.getItem("fn_bookmarks") || "[]");

/* ── INIT ── */
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  }, 1300);
  initDarkMode();
  buildSemTabs();
  buildPopular();
  renderCards();
});

/* ── SEM TABS ── */
function buildSemTabs() {
  const container = document.getElementById("semTabs");
  const sems = ["all", 1, 2, 3, 4, 5, 6];
  container.innerHTML = sems.map(s =>
    `<button class="sem-tab ${s === "all" ? "active" : ""}"
      onclick="selectSem(this,'${s}')">${s === "all" ? "All Sems" : "Sem " + s}</button>`
  ).join("");
}

function selectSem(el, val) {
  document.querySelectorAll(".sem-tab").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  activeSem = val === "all" ? "all" : parseInt(val);
  renderCards();
}

/* ── BRANCH CHANGE ── */
function onBranchChange() {
  activeBranch = document.getElementById("branchFilter").value;
  renderCards();
}

/* ── POPULAR CHIPS ── */
function buildPopular() {
  const popular = SUBJECTS.filter(s => s.popular).slice(0, 6);
  document.getElementById("popularChips").innerHTML = popular.map(s =>
    `<span class="popular-chip" onclick="searchFor('${s.name}')">${s.icon} ${s.name}</span>`
  ).join("");
}

function searchFor(name) {
  document.getElementById("heroSearch").value = name;
  renderCards();
}

/* ── RENDER CARDS ── */
function renderCards() {
  const search = document.getElementById("heroSearch").value.toLowerCase();
  const branch = document.getElementById("branchFilter").value;
  const typeF  = document.getElementById("typeFilter").value;

  const filtered = SUBJECTS.filter(s => {
    const matchBranch  = branch === "all" || s.branch === branch;
    const matchSem     = activeSem === "all" || s.sem === activeSem;
    const matchType    = typeF === "all" || s.type === typeF;
    const matchSearch  = !search || s.name.toLowerCase().includes(search) || s.desc.toLowerCase().includes(search);
    return matchBranch && matchSem && matchType && matchSearch;
  });

  document.getElementById("resultsCount").textContent =
    `${filtered.length} subject${filtered.length !== 1 ? "s" : ""} found`;

  const grid = document.getElementById("subjectsGrid");

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results">😕 No subjects match your filters.<br>Try changing branch, semester or search term.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(s => {
    const isSaved = bookmarks.includes(s.id);
    return `
    <div class="subject-card ${s.branch}">
      <div class="subject-card-top">
        <div class="subject-icon">${s.icon}</div>
        <span class="resource-count-badge">📦 ${s.resources} resources</span>
      </div>
      <div class="subject-name">${s.name}</div>
      <div class="subject-desc">${s.desc}</div>
      <div class="subject-meta">
        <span class="meta-chip">${s.branch.toUpperCase()} · Sem ${s.sem}</span>
        <span class="meta-chip ${s.type.toLowerCase()}">${s.type}</span>
      </div>
      <div class="subject-card-footer">
        <button class="btn-view" onclick="viewResources(${s.id})">📖 View Resources</button>
        <button class="btn-bookmark ${isSaved ? "saved" : ""}"
          title="${isSaved ? "Remove bookmark" : "Bookmark"}"
          onclick="toggleBookmark(${s.id}, this)">${isSaved ? "🔖" : "🔲"}</button>
      </div>
    </div>`;
  }).join("");
}

/* ── BOOKMARK ── */
function toggleBookmark(id, btn) {
  if (bookmarks.includes(id)) {
    bookmarks = bookmarks.filter(b => b !== id);
    btn.classList.remove("saved");
    btn.textContent = "🔲";
  } else {
    bookmarks.push(id);
    btn.classList.add("saved");
    btn.textContent = "🔖";
  }
  localStorage.setItem("fn_bookmarks", JSON.stringify(bookmarks));
}

/* ── VIEW RESOURCES ── */
function viewResources(id) {
  localStorage.setItem("fn_selected_subject", id);
  window.location.href = "page5.html";
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
