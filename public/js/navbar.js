
// Inject navbar HTML into the top of the body
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.createElement("div");
  navbar.className = "navbar";
  navbar.innerHTML = `
    <h1>Portfol.io</h1>
    <div class="nav-links">
      <a href="home.html">Home</a>
      <a href="portfolio.html">My Portfolio</a>
      <a href="#" id="logoutBtn">Logout</a>
    </div>
  `;
  document.body.insertBefore(navbar, document.body.firstChild);

  // Attach logout functionality
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("loginExpiry");
      window.location.href = "login.html";
    });
  }
});
