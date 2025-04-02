console.log("✅ home.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("feed-container");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");

  let allUsers = [];

  // 1) Reusable function to render the feed
  function renderFeed(users) {
    container.innerHTML = "";

    users.forEach(user => {
      const card = document.createElement("div");
      card.className = "project-card";

      // Basic user data
      const profileImg = user.profile_img || "images/default.jpg";
      const skills = user.skills?.map(s => s.title).join(", ") || "No skills";
      const projects = user.projects?.map(p => p.title).join(", ") || "No projects";

      card.innerHTML = `
        <img src="${profileImg}" alt="Profile Image" />
        <h2>${user.fullName}</h2>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Skills:</strong> ${skills}</p>
        <p><strong>Projects:</strong> ${projects}</p>

        <div class="vote-button-group">
          <p>Score: <span class="vote-score" data-id="${user._id}">${user.votes || 0}</span></p>
          <button class="btn-upvote" data-id="${user._id}">▲</button>
          <button class="btn-downvote" data-id="${user._id}">▼</button>
        </div>

        <button class="btn-view" data-username="${user.username}">
          View Portfolio
        </button>
      `;
      container.appendChild(card);
    });
  }

  // 2) Fetch from /api/posts
  async function fetchUsers() {
    try {
      const res = await fetch("/api/posts");
      const posts = await res.json();

      if (!Array.isArray(posts)) {
        throw new Error("Invalid response from /api/posts");
      }

      allUsers = posts;
      renderFeed(allUsers);
    } catch (err) {
      console.error("❌ Failed to load posts:", err);
      container.innerHTML = "<p>Error loading home feed.</p>";
    }
  }

  // 3) Hook up Search
  searchInput?.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allUsers.filter(user =>
      user.username.toLowerCase().includes(query)
    );
    renderFeed(filtered);
  });

  // 4) Hook up Sort
  sortSelect?.addEventListener("change", () => {
    let sorted = [...allUsers];
    if (sortSelect.value === "votes-desc") {
      sorted.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    } else if (sortSelect.value === "votes-asc") {
      sorted.sort((a, b) => (a.votes || 0) - (b.votes || 0));
    }
    renderFeed(sorted);
  });

  // 5) Listen for clicks on container (View, Upvote, Downvote)
  container.addEventListener("click", async (e) => {
    // (A) View portfolio
    if (e.target.classList.contains("btn-view")) {
      const userToView = e.target.getAttribute("data-username");
      window.location.href = `portfolio.html?user=${userToView}`;
      return;
    }

    // (B) Upvote / Downvote
    if (e.target.classList.contains("btn-upvote") || e.target.classList.contains("btn-downvote")) {
      const userId = e.target.getAttribute("data-id");
      const voteType = e.target.classList.contains("btn-upvote") ? "upvote" : "downvote";

      try {
        const loggedInUsername = sessionStorage.getItem("loggedInUser");

const res = await fetch(`/api/users/${userId}/${voteType}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ voterName: loggedInUsername })
});

        const updatedUser = await res.json();

        if (res.ok) {
          // Update in allUsers array too
          const index = allUsers.findIndex(u => u._id === userId);
          if (index >= 0) {
            allUsers[index].votes = updatedUser.votes;
          }

          // Update DOM
          const scoreSpan = document.querySelector(`.vote-score[data-id="${userId}"]`);
          scoreSpan.textContent = updatedUser.votes ?? 0;
        } else {
          alert("Vote failed: " + updatedUser.message);
        }
      } catch (err) {
        console.error(err);
        alert("Voting failed due to a network error.");
      }
    }
  });

  // 6) Initial load
  await fetchUsers();
});
