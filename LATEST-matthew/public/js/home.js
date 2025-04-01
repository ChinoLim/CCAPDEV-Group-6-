console.log("✅ home.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("feed-container");

  try {
    const res = await fetch("/api/posts"); // or wherever you get user data
    const posts = await res.json();

    if (!Array.isArray(posts)) throw new Error("Invalid response");

    if (posts.length === 0) {
      container.innerHTML = "<p>No recent portfolios found.</p>";
      return;
    }

    posts.forEach(user => {
      const card = document.createElement("div");
      card.className = "project-card";

      const profileImg = user.profile_img || "images/default.jpg";
      const skills = user.skills?.map(s => s.title).join(", ") || "No skills";
      const projects = user.projects?.map(p => p.title).join(", ") || "No projects";

      card.innerHTML = `
        <img src="${profileImg}" alt="Profile Image" />
        <h2>${user.fullName}</h2>
        <p><strong>Skills:</strong> ${skills}</p>
        <p><strong>Projects:</strong> ${projects}</p>
        <button class="btn-view" data-username="${user.username}">
          View Portfolio
        </button>
      `;
      container.appendChild(card);
    });

    // Listen for clicks on the "View Portfolio" button
    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-view')) {
        const userToView = e.target.getAttribute('data-username');
        // Redirect to portfolio.html?user=that_username
        window.location.href = `portfolio.html?user=${userToView}`;
      }
    });

  } catch (err) {
    console.error("❌ Failed to load feed:", err);
    container.innerHTML = "<p>Error loading home feed.</p>";
  }
});
