

/* ---------- QUIZ ---------- */

let score = 0;

function correct() {
  score += 10;
  document.getElementById("score").innerText = score;
  document.getElementById("feedback").innerText = "✅ Correct!";
}

function wrong() {
  document.getElementById("feedback").innerText = "❌ Try Again!";
}

/* FEATURE SCROLL ANIMATION  */

function initScrollAnimation() {
  const featureRows = document.querySelectorAll('.feature-row');

  window.addEventListener('scroll', () => {
    featureRows.forEach(row => {
      const position = row.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.2;

      if (position < screenPosition) {
        row.classList.add('show');
      }
    });
  });
}

/*  LOGIN / LOCK SYSTEM  */

function logoutUser() {
  localStorage.removeItem("loggedIn");
  alert("Logged out");
  location.reload();
}

function checkLogin() {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const protectedLinks = document.querySelectorAll(".protected");

  protectedLinks.forEach(link => {
    if (isLoggedIn === "true") {
      // Remove lock icon if present
      link.innerHTML = link.innerHTML.replace("🔒 ", "");
    } else {
      // Add lock icon if not already present
      if (!link.innerHTML.includes("🔒")) {
        link.innerHTML = "🔒 " + link.innerHTML;
      }

      link.addEventListener("click", function (e) {
        e.preventDefault();
        alert("🔒 Please login first to access this feature");
      });
    }
  });
}

/* INIT ON DOM READY  */

document.addEventListener("DOMContentLoaded", () => {
  checkLogin();
  initScrollAnimation();
  initDarkMode();
  initLoader();
  initTypewriter();
  initCounters();
});

/*  LOADER  */
function initLoader() {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  }, 1300);
}

/*  DARK MODE */
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

/* TYPEWRITER  */
function initTypewriter() {
  const el = document.getElementById("typewriterText");
  if (!el) return;
  const phrases = [
    "Your Smart Study Partner 🎯",
    "Ace Every Exam 📝",
    "Stay Focused, Stay Ahead ⏱️",
    "Smart Tasks. Smart Results. ✅",
    "Study Smarter, Not Harder 🧠"
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  type();
}

/*  COUNTER ANIMATION  */
function initCounters() {
  const counters = document.querySelectorAll(".stat-num[data-target]");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const isRating = target === 49;
      let start = 0;
      const duration = 1800;
      const step = Math.ceil(target / (duration / 16));

      const tick = () => {
        start = Math.min(start + step, target);
        el.textContent = isRating
          ? (start / 10).toFixed(1)
          : start.toLocaleString();
        if (start < target) requestAnimationFrame(tick);
      };
      tick();
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
