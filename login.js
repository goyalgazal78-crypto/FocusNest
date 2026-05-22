
function loginUser() {
  const email    = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const correctEmail    = "gazalnoor20072007@gmail.com";
  const correctPassword = "project";

  if (email === correctEmail && password === correctPassword) {
    localStorage.setItem("loggedIn", "true");
    alert("Login Successful! Welcome to FocusNest");
    window.location.href = "page2.html";
  } else {
    document.getElementById("message").innerText = "Invalid Email or Password";
  }
}


(function initDarkMode() {
  if (localStorage.getItem("fn_dark") === "true") {
    document.body.classList.add("dark-mode");
    const icon = document.getElementById("darkIcon");
    const label = document.getElementById("darkLabel");
    if (icon)  icon.className    = "ti ti-sun";
    if (label) label.textContent = "Light";
  }
})();

function toggleDark() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("fn_dark", isDark);
  const icon  = document.getElementById("darkIcon");
  const label = document.getElementById("darkLabel");
  if (icon)  icon.className    = isDark ? "ti ti-sun" : "ti ti-moon";
  if (label) label.textContent = isDark ? "Light" : "Dark";
}
