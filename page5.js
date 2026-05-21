/* ===========================
   FocusNest — page5.js
   (Resource Library)
   =========================== */

/* ── RESOURCE DATA ── */
const ALL_RESOURCES = [
  {id:101, subjectId:5,  type:"notes",  icon:"📄", title:"Data Structures – GeeksForGeeks",      subject:"Data Structures",     desc:"Complete DSA theory: arrays, linked lists, trees, graphs, hashing & sorting with code examples.",                   url:"https://www.geeksforgeeks.org/data-structures/",                             rating:4.8, votes:124, videos:null, pages:null, year:null},
  {id:102, subjectId:5,  type:"video",  icon:"🎥", title:"DSA Full Course – Jenny's Lectures",    subject:"Data Structures",     desc:"200+ video DSA course covering all major data structures with detailed explanations.",                            url:"https://www.youtube.com/playlist?list=PLdo5W4Nhv31bbKLgByFB-cY4NF2LZqHFu", rating:4.9, votes:210, videos:200, pages:null, year:null},
  {id:103, subjectId:5,  type:"pyq",    icon:"📝", title:"DS PYQs – AKTU University",             subject:"Data Structures",     desc:"Previous year question papers for Data Structures with solutions.",                                           url:"https://www.aktu.ac.in/syllabus-download.aspx",                              rating:4.7, votes:98,  videos:null, pages:45,   year:2024},
  {id:104, subjectId:5,  type:"slides", icon:"🎨", title:"DSA Slides – MIT OpenCourseWare",       subject:"Data Structures",     desc:"Official MIT 6.006 lecture slides on data structures and algorithms.",                                           url:"https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/",   rating:4.9, votes:178, videos:null, pages:220,  year:null},
  {id:201, subjectId:8,  type:"notes",  icon:"📄", title:"OS Notes – Gate Smashers",              subject:"Operating Systems",   desc:"Comprehensive OS notes: scheduling, memory, file systems, deadlocks & I/O.",                                    url:"https://www.gatesmashers.com/operating-system/",                             rating:4.7, votes:145, videos:null, pages:96,   year:null},
  {id:202, subjectId:8,  type:"video",  icon:"🎥", title:"OS Full Course – Neso Academy",         subject:"Operating Systems",   desc:"High quality OS series with animations: paging, segmentation, virtual memory.",                                 url:"https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O", rating:4.9, votes:189, videos:45,  pages:null, year:null},
  {id:203, subjectId:8,  type:"book",   icon:"📖", title:"Modern OS – Tanenbaum (OCW Slides)",    subject:"Operating Systems",   desc:"Official slide decks from Andrew Tanenbaum's Modern Operating Systems textbook.",                               url:"https://www.pearsonhighered.com/tanenbaum-os-info/",                          rating:4.8, votes:234, videos:null, pages:800,  year:null},
  {id:204, subjectId:8,  type:"pyq",    icon:"📝", title:"OS PYQ – GATE Previous Papers",         subject:"Operating Systems",   desc:"Solved GATE previous year OS questions from 2010–2024.",                                                        url:"https://www.geeksforgeeks.org/gate-previous-year-q-a-operating-system/",    rating:4.6, votes:112, videos:null, pages:50,   year:2024},
  {id:301, subjectId:9,  type:"notes",  icon:"📄", title:"DBMS Complete Notes – GFG",             subject:"Database Management", desc:"ER diagrams, normalization 1NF–BCNF, SQL, transactions & concurrency control.",                                url:"https://www.geeksforgeeks.org/dbms/",                                        rating:4.7, votes:130, videos:null, pages:78,   year:null},
  {id:302, subjectId:9,  type:"video",  icon:"🎥", title:"DBMS Full Course – Neso Academy",       subject:"Database Management", desc:"50+ video DBMS lectures: SQL joins, normalization, ACID, indexing, B-trees.",                                  url:"https://www.youtube.com/playlist?list=PLBlnK6fEyqRi_CUQ-FXxgzKQ-d0Ks9pyw", rating:4.8, votes:178, videos:52,  pages:null, year:null},
  {id:303, subjectId:9,  type:"pyq",    icon:"📝", title:"DBMS GATE PYQ – Solved",                subject:"Database Management", desc:"GATE solved DBMS questions 2010–2024 including SQL query tracing.",                                             url:"https://www.geeksforgeeks.org/gate-previous-year-q-a-dbms/",               rating:4.6, votes:88,  videos:null, pages:40,   year:2024},
  {id:401, subjectId:11, type:"notes",  icon:"📄", title:"Algorithms – GFG Complete Guide",       subject:"Algorithms",          desc:"Divide & conquer, greedy, DP, backtracking, graph algorithms with complexity analysis.",                         url:"https://www.geeksforgeeks.org/fundamentals-of-algorithms/",                 rating:4.8, votes:156, videos:null, pages:90,   year:null},
  {id:402, subjectId:11, type:"video",  icon:"🎥", title:"MIT 6.006 – Intro to Algorithms",       subject:"Algorithms",          desc:"World-class MIT algorithm lectures: sorting, hashing, graphs, DP — freely available.",                          url:"https://www.youtube.com/playlist?list=PLUl4u3cNGP61Oq3tWYp6V_F-5jb5L2iHb", rating:4.9, votes:267, videos:34,  pages:null, year:null},
  {id:403, subjectId:11, type:"book",   icon:"📖", title:"CLRS – Algorithm Visualizations",       subject:"Algorithms",          desc:"Interactive CLRS companion with algorithm visualizations, pseudocode and complexity comparisons.",                url:"https://algoflare.com/",                                                     rating:5.0, votes:312, videos:null, pages:null, year:null},
  {id:404, subjectId:11, type:"pyq",    icon:"📝", title:"Algorithms GATE PYQ – Solved",          subject:"Algorithms",          desc:"GATE algorithms solved questions with time complexity justification.",                                           url:"https://www.geeksforgeeks.org/gate-previous-year-q-a-algorithms/",          rating:4.5, votes:74,  videos:null, pages:38,   year:2024},
  {id:501, subjectId:13, type:"notes",  icon:"📄", title:"ML Notes – Towards Data Science",       subject:"Machine Learning",    desc:"ML guides: regression, SVM, decision trees, neural networks with Python code.",                                   url:"https://towardsdatascience.com/",                                            rating:4.9, votes:201, videos:null, pages:null, year:null},
  {id:502, subjectId:13, type:"video",  icon:"🎥", title:"ML Specialization – Andrew Ng (Free)",  subject:"Machine Learning",    desc:"The world's most popular ML course on Coursera — audit for free.",                                              url:"https://www.coursera.org/specializations/machine-learning-introduction",     rating:5.0, votes:445, videos:80,  pages:null, year:null},
  {id:503, subjectId:13, type:"slides", icon:"🎨", title:"Stanford CS229 – ML Lecture Notes",     subject:"Machine Learning",    desc:"Official Stanford CS229 notes — same material Andrew Ng teaches, free PDF.",                                    url:"https://cs229.stanford.edu/lectures-spring2022/main_notes.pdf",             rating:4.9, votes:289, videos:null, pages:310,  year:null},
  {id:601, subjectId:10, type:"notes",  icon:"📄", title:"Computer Networks – GFG Notes",         subject:"Computer Networks",   desc:"OSI model, TCP/IP, subnetting, routing protocols, DNS, HTTP and security.",                                     url:"https://www.geeksforgeeks.org/computer-network-tutorials/",                 rating:4.6, votes:119, videos:null, pages:88,   year:null},
  {id:602, subjectId:10, type:"video",  icon:"🎥", title:"Computer Networks – Gate Smashers",     subject:"Computer Networks",   desc:"Complete CN playlist for GATE — subnetting, routing, transport & application layers.",                          url:"https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_", rating:4.8, votes:187, videos:55,  pages:null, year:null},
  {id:603, subjectId:10, type:"book",   icon:"📖", title:"Computer Networks – Tanenbaum OCW",     subject:"Computer Networks",   desc:"Tanenbaum's Computer Networks companion resources and lecture material.",                                        url:"https://www.pearsonhighered.com/tanenbaum-cn-info/",                         rating:4.7, votes:145, videos:null, pages:920,  year:null},
  {id:701, subjectId:23, type:"notes",  icon:"📄", title:"Thermodynamics Notes – NPTEL",          subject:"Thermodynamics",      desc:"NPTEL engineering thermodynamics: laws, entropy, Carnot, Rankine, refrigeration.",                              url:"https://nptel.ac.in/courses/112105123",                                      rating:4.6, votes:98,  videos:null, pages:75,   year:null},
  {id:702, subjectId:23, type:"video",  icon:"🎥", title:"Engineering Thermodynamics – NPTEL",    subject:"Thermodynamics",      desc:"IIT Kharagpur NPTEL thermodynamics — 40 full lectures, freely available.",                                       url:"https://www.youtube.com/playlist?list=PLF7C73918190C98CA",                  rating:4.7, votes:134, videos:40,  pages:null, year:null},
  {id:703, subjectId:23, type:"pyq",    icon:"📝", title:"Thermodynamics – GATE PYQ Solved",      subject:"Thermodynamics",      desc:"GATE Mechanical solved thermodynamics questions with numerical solutions.",                                      url:"https://www.geeksforgeeks.org/mechanical-engineering/",                     rating:4.5, votes:76,  videos:null, pages:44,   year:2024},
  {id:801, subjectId:18, type:"notes",  icon:"📄", title:"Signals & Systems – GFG Notes",         subject:"Signals & Systems",   desc:"Fourier series/transform, Laplace, Z-transform, convolution and LTI analysis.",                                 url:"https://www.geeksforgeeks.org/signals-and-systems/",                        rating:4.7, votes:108, videos:null, pages:82,   year:null},
  {id:802, subjectId:18, type:"video",  icon:"🎥", title:"S&S – NPTEL IIT Bombay Lectures",       subject:"Signals & Systems",   desc:"NPTEL certified IIT Bombay course — 42 lectures with assignments.",                                             url:"https://nptel.ac.in/courses/117101051",                                      rating:4.8, votes:145, videos:42,  pages:null, year:null},
  {id:901, subjectId:14, type:"notes",  icon:"📄", title:"Web Dev Notes – MDN Web Docs",          subject:"Web Technologies",    desc:"Official Mozilla reference — gold standard for HTML, CSS, JavaScript and APIs.",                                url:"https://developer.mozilla.org/",                                            rating:4.9, votes:312, videos:null, pages:null, year:null},
  {id:902, subjectId:14, type:"video",  icon:"🎥", title:"Full Stack Dev – The Odin Project",     subject:"Web Technologies",    desc:"Free full-stack curriculum: HTML, CSS, JS, Node.js, databases and React with projects.",                         url:"https://www.theodinproject.com/",                                           rating:4.9, votes:267, videos:null, pages:null, year:null},
  {id:903, subjectId:14, type:"slides", icon:"🎨", title:"Web Technologies – Stanford CS142",     subject:"Web Technologies",    desc:"Stanford CS142 official lecture slides for web technologies — freely available.",                               url:"https://web.stanford.edu/class/cs142/",                                     rating:4.7, votes:134, videos:null, pages:180,  year:null},
  {id:1001,subjectId:2,  type:"notes",  icon:"📄", title:"C Programming – Learn-C.org",           subject:"Programming in C",    desc:"Interactive C programming tutorials: pointers, memory management, file I/O.",                                   url:"https://www.learn-c.org/",                                                  rating:4.6, votes:112, videos:null, pages:null, year:null},
  {id:1002,subjectId:2,  type:"video",  icon:"🎥", title:"C Programming – Jenny's Lectures",      subject:"Programming in C",    desc:"Complete C course — 100+ videos covering all topics with exercises.",                                           url:"https://www.youtube.com/playlist?list=PLdo5W4Nhv31a8UcMN9-35ghv8qyFWD9_S", rating:4.7, votes:167, videos:100, pages:null, year:null},
  {id:1101,subjectId:16, type:"notes",  icon:"📄", title:"Basic Electronics – Electronics Hub",   subject:"Basic Electronics",   desc:"Diodes, transistors, op-amps, power supplies and oscillators with diagrams.",                                   url:"https://www.electronicshub.org/",                                           rating:4.5, votes:89,  videos:null, pages:null, year:null},
  {id:1102,subjectId:16, type:"video",  icon:"🎥", title:"Electronics – NPTEL NOC Lectures",      subject:"Basic Electronics",   desc:"NPTEL Basic Electronics from IIT Kharagpur — 40 lectures on semiconductor devices.",                           url:"https://nptel.ac.in/courses/117105080",                                      rating:4.7, votes:112, videos:40,  pages:null, year:null},
];

const SUBJECTS_MAP = {
  2:  {name:"Programming in C",    icon:"💻"},
  5:  {name:"Data Structures",     icon:"🌲"},
  8:  {name:"Operating Systems",   icon:"🖥️"},
  9:  {name:"Database Management", icon:"🗄️"},
  10: {name:"Computer Networks",   icon:"🌐"},
  11: {name:"Algorithms",          icon:"⚙️"},
  13: {name:"Machine Learning",    icon:"🤖"},
  14: {name:"Web Technologies",    icon:"🌍"},
  16: {name:"Basic Electronics",   icon:"⚡"},
  18: {name:"Signals & Systems",   icon:"📡"},
  23: {name:"Thermodynamics",      icon:"🌡️"}
};

/* ── STATE ── */
let activeType      = "all";
let upvoted         = JSON.parse(localStorage.getItem("fn_upvoted")  || "[]");
let recentlyViewed  = JSON.parse(localStorage.getItem("fn_recently") || "[]");
let userUploads     = JSON.parse(localStorage.getItem("fn_uploads")  || "[]");
let selectedSubjectId = null;
let ytApiKey        = localStorage.getItem("fn_yt_api_key") || "";

/* ── INIT ── */
document.addEventListener("DOMContentLoaded", () => {

  // Hide loader
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  }, 1300);

  // Dark mode
  initDarkMode();

  selectedSubjectId = parseInt(localStorage.getItem("fn_selected_subject") || "0") || null;
  buildHero();
  buildRecentlyViewed();
  renderCards();
  if (ytApiKey) document.getElementById("ytApiBox").style.display = "none";
  if (selectedSubjectId && SUBJECTS_MAP[selectedSubjectId]) {
    document.getElementById("ytQ").value = SUBJECTS_MAP[selectedSubjectId].name + " lecture";
  }

  /* modal outside-click close */
  document.getElementById("previewModal").addEventListener("click", e => {
    if (e.target === document.getElementById("previewModal")) closePreview();
  });
  document.getElementById("uploadModal").addEventListener("click", e => {
    if (e.target === document.getElementById("uploadModal")) closeUpload();
  });
});

/* ── HERO ── */
function buildHero() {
  const all  = [...ALL_RESOURCES, ...userUploads.map(u => ({...u, type:"uploaded"}))];
  const list = selectedSubjectId ? all.filter(r => r.subjectId === selectedSubjectId) : all;
  if (selectedSubjectId && SUBJECTS_MAP[selectedSubjectId]) {
    const s = SUBJECTS_MAP[selectedSubjectId];
    document.getElementById("heroTitle").textContent = s.icon + " " + s.name;
  }
  document.getElementById("heroResCount").textContent  = list.length;
  document.getElementById("heroTypeCount").textContent = [...new Set(list.map(r => r.type))].length;
}

/* ── RECENTLY VIEWED ── */
function buildRecentlyViewed() {
  if (!recentlyViewed.length) return;
  const all = [...ALL_RESOURCES, ...userUploads];
  document.getElementById("recentlyCard").style.display = "block";
  document.getElementById("recentlyChips").innerHTML = recentlyViewed.slice(0, 6).map(id => {
    const r = all.find(x => x.id === id);
    return r ? `<span class="recently-chip" onclick="openPreview(${r.id})">${r.icon} ${r.title.slice(0,28)}…</span>` : "";
  }).join("");
}

function logView(id) {
  recentlyViewed = [id, ...recentlyViewed.filter(x => x !== id)].slice(0, 10);
  localStorage.setItem("fn_recently", JSON.stringify(recentlyViewed));
  buildRecentlyViewed();
}

/* ── FILTER CHIPS ── */
function setType(type, el) {
  document.querySelectorAll(".fchip").forEach(c => c.classList.remove("active"));
  el.classList.add("active");
  activeType = type;
  renderCards();
}

/* ── RENDER CARDS ── */
function renderCards() {
  const search  = document.getElementById("searchBar").value.toLowerCase();
  const uploads = userUploads.map(u => ({...u, type:"uploaded"}));
  let list = [...ALL_RESOURCES, ...uploads];
  if (selectedSubjectId) list = list.filter(r => r.subjectId === selectedSubjectId);
  if (activeType !== "all") list = list.filter(r => r.type === activeType);
  if (search) list = list.filter(r =>
    r.title.toLowerCase().includes(search) ||
    r.subject.toLowerCase().includes(search) ||
    (r.desc || "").toLowerCase().includes(search)
  );

  document.getElementById("resCount").textContent = `${list.length} resource${list.length !== 1 ? "s" : ""}`;
  const grid = document.getElementById("resourcesGrid");

  if (!list.length) {
    grid.innerHTML = `<div class="no-results">😕 No resources match your search.<br>Try a different keyword or upload one yourself!</div>`;
    return;
  }

  grid.innerHTML = list.map(r => {
    const isVoted  = upvoted.includes(r.id);
    const votes    = (r.votes || 0) + (isVoted ? 1 : 0);
    const isUp     = r.type === "uploaded";
    const meta     = [
      r.pages  ? `📄 ${r.pages} pages`   : null,
      r.videos ? `🎥 ${r.videos} videos` : null,
      r.year   ? `📅 ${r.year}`          : null,
      r.author ? `👤 ${r.author}`        : null,
    ].filter(Boolean);
    const btnLabel = r.type === "video" ? "▶ Watch / Open" : isUp ? "🔗 Open Link" : "⬇️ Open Resource";
    const delBtn   = isUp ? `<button class="btn-del" title="Delete" onclick="deleteUpload(${r.id})">🗑️</button>` : "";

    return `<div class="resource-card ${r.type}">
      <div class="rc-top">
        <span class="rc-badge ${r.type}">${typeLabel(r.type)}</span>
        <div class="rc-rating">⭐ ${r.rating || "—"}</div>
      </div>
      <div class="rc-icon">${r.icon || "📎"}</div>
      <div class="rc-title">${r.title}</div>
      <div class="rc-subject">📚 ${r.subject || "—"}</div>
      <div class="rc-desc">${r.desc || ""}</div>
      <div class="rc-meta">${meta.map(t => `<span class="rc-tag">${t}</span>`).join("")}</div>
      <div class="rc-footer">
        <button class="btn-open ${r.type}" onclick="openPreview(${r.id})">${btnLabel}</button>
        <button class="btn-upvote ${isVoted ? "voted" : ""}" onclick="toggleUpvote(${r.id},this)">
          <span class="uv-i">❤️</span>
          <span class="uv-c" id="vc_${r.id}">${votes}</span>
        </button>
        ${delBtn}
      </div>
    </div>`;
  }).join("");
}

function typeLabel(t) {
  return {notes:"📄 Notes", video:"🎥 Video", pyq:"📝 PYQ", book:"📖 Book", slides:"🎨 Slides", uploaded:"🌱 Uploaded"}[t] || t;
}

/* ── UPVOTE ── */
function toggleUpvote(id, btn) {
  const all = [...ALL_RESOURCES, ...userUploads];
  const r   = all.find(x => x.id === id);
  if (upvoted.includes(id)) {
    upvoted = upvoted.filter(x => x !== id);
    btn.classList.remove("voted");
    document.getElementById("vc_" + id).textContent = r ? r.votes : 0;
  } else {
    upvoted.push(id);
    btn.classList.add("voted");
    document.getElementById("vc_" + id).textContent = (r ? r.votes : 0) + 1;
  }
  localStorage.setItem("fn_upvoted", JSON.stringify(upvoted));
}

/* ── PREVIEW MODAL ── */
function openPreview(id) {
  const all = [...ALL_RESOURCES, ...userUploads.map(u => ({...u, type:"uploaded"}))];
  const r   = all.find(x => x.id === id);
  if (!r) return;
  logView(id);
  document.getElementById("prevIcon").textContent  = r.icon || "📎";
  document.getElementById("prevTitle").textContent = r.title;
  document.getElementById("prevDesc").textContent  = r.desc || "";
  const tags = [
    r.rating ? `⭐ ${r.rating}`        : null,
    r.votes  ? `❤️ ${r.votes} upvotes` : null,
    r.pages  ? `📄 ${r.pages} pages`   : null,
    r.videos ? `🎥 ${r.videos} videos` : null,
    r.year   ? `📅 ${r.year}`          : null,
    r.author ? `👤 ${r.author}`        : null,
  ].filter(Boolean);
  document.getElementById("prevTags").innerHTML = tags.map(t => `<span class="prev-tag">${t}</span>`).join("");
  const btn = document.getElementById("prevMainBtn");
  btn.textContent = r.type === "video" ? "▶ Open Playlist / Video" : "🔗 Open Resource";
  btn.onclick = () => { window.open(r.url, "_blank"); closePreview(); };
  document.getElementById("previewModal").classList.add("open");
}

function closePreview() {
  document.getElementById("previewModal").classList.remove("open");
}

/* ── UPLOAD MODAL ── */
function openUpload()  { document.getElementById("uploadModal").classList.add("open");    }
function closeUpload() { document.getElementById("uploadModal").classList.remove("open"); }

function submitUpload() {
  const title = document.getElementById("upTitle").value.trim();
  const url   = document.getElementById("upUrl").value.trim();
  if (!title) { showToast("⚠️ Enter a title!", "#ffa500"); return; }
  if (!url)   { showToast("⚠️ Enter a link!",  "#ffa500"); return; }
  try { new URL(url); } catch { showToast("⚠️ Invalid URL!", "#ffa500"); return; }

  const type = document.getElementById("upType").value;
  userUploads.push({
    id: Date.now(),
    subjectId: selectedSubjectId || null,
    type,
    icon:    {notes:"📄", video:"🎥", pyq:"📝", book:"📖", slides:"🎨"}[type] || "📎",
    title,
    subject: document.getElementById("upSubject").value.trim() || "General",
    desc:    document.getElementById("upDesc").value.trim()    || "Student-uploaded resource.",
    url,
    votes: 0, rating: null,
    author: document.getElementById("upAuthor").value.trim() || "Anonymous"
  });
  localStorage.setItem("fn_uploads", JSON.stringify(userUploads));
  ["upTitle","upSubject","upUrl","upDesc","upAuthor"].forEach(id => document.getElementById(id).value = "");
  closeUpload();
  buildHero();
  renderCards();
  showToast("✅ Resource uploaded successfully!");
}

function deleteUpload(id) {
  if (!confirm("Remove this resource?")) return;
  userUploads = userUploads.filter(u => u.id !== id);
  localStorage.setItem("fn_uploads", JSON.stringify(userUploads));
  buildHero();
  renderCards();
  showToast("🗑️ Removed.", "#ff6b6b");
}

/* ── YOUTUBE ── */
function saveYTKey() {
  const k = document.getElementById("ytKeyInput").value.trim();
  if (!k) { showToast("⚠️ Paste your API key!", "#ffa500"); return; }
  ytApiKey = k;
  localStorage.setItem("fn_yt_api_key", k);
  document.getElementById("ytApiBox").style.display = "none";
  showToast("✅ YouTube API key saved!");
}

async function searchYT() {
  const q = document.getElementById("ytQ").value.trim();
  if (!q) { showToast("⚠️ Enter a search term!", "#ffa500"); return; }

  const wrap  = document.getElementById("ytResultsWrap");
  const grid  = document.getElementById("ytGrid");
  const title = document.getElementById("ytResultsTitle");
  wrap.style.display = "block";
  title.textContent  = `🎥 YouTube Results for "${q}"`;

  if (!ytApiKey) {
    document.getElementById("ytApiBox").style.display = "block";
    grid.innerHTML = `<div class="yt-error">🔑 Save your YouTube API key above to enable live search.</div>`;
    return;
  }

  grid.innerHTML = `<div class="yt-msg">⏳ Fetching videos from YouTube…</div>`;
  try {
    const res  = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q + " lecture tutorial")}&type=video&maxResults=6&relevanceLanguage=en&key=${ytApiKey}`);
    const data = await res.json();
    if (data.error) {
      grid.innerHTML = `<div class="yt-error">❌ ${data.error.message}<br><small>Check your API key or quota.</small></div>`;
      return;
    }
    if (!data.items?.length) {
      grid.innerHTML = `<div class="yt-error">😕 No results found.</div>`;
      return;
    }
    grid.innerHTML = data.items.map(item => {
      const vid = item.id.videoId;
      const url = `https://www.youtube.com/watch?v=${vid}`;
      return `<div class="yt-card" onclick="window.open('${url}','_blank')">
        <img class="yt-thumb" src="${item.snippet.thumbnails.medium.url}" loading="lazy">
        <div class="yt-card-body">
          <div class="yt-card-title">${item.snippet.title}</div>
          <div class="yt-card-channel">📺 ${item.snippet.channelTitle}</div>
          <button class="yt-card-btn" onclick="event.stopPropagation();window.open('${url}','_blank')">▶ Watch on YouTube</button>
        </div>
      </div>`;
    }).join("");
  } catch(e) {
    grid.innerHTML = `<div class="yt-error">❌ Network error. Check your connection.</div>`;
  }
}

/* ── TOAST ── */
function showToast(msg, bg) {
  const t = document.getElementById("toast");
  t.textContent      = msg;
  t.style.background = bg || "#28c76f";
  t.style.opacity    = "1";
  t.style.transform  = "translateY(0)";
  setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateY(10px)"; }, 2800);
}

/* ── LOGOUT ── */
function logoutUser() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
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
