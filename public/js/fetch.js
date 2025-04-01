console.log("✅ fetch.js is loaded");

document.addEventListener('DOMContentLoaded', () => {
  let currentUser = null;

  // 1) If not logged in, go to login
  const loggedInUsername = localStorage.getItem('loggedInUser');
  if (!loggedInUsername) {
    alert("Please log in first.");
    window.location.href = "login.html";
    return;
  }

  // 2) Get username to view from URL param (e.g. portfolio.html?user=janesmith)
  const params = new URLSearchParams(window.location.search);
  const paramUser = params.get('user');

  // If no ?user=..., default to the logged-in user
  const targetUsername = paramUser || loggedInUsername;

  // 3) Load that user's data from /api/users/...
  async function loadUserData() {
    try {
      const res = await fetch(`/api/users/${targetUsername}`);
      if (!res.ok) throw new Error(`User not found: ${targetUsername}`);
      currentUser = await res.json();
      window.currentUser = currentUser;
      fillUserProfile(currentUser);

      // If we are NOT the same user => hide all edit features
      if (targetUsername.toLowerCase() !== loggedInUsername.toLowerCase()) {
        console.log("👀 Viewing someone else's portfolio => Hiding edit buttons");
        hideEditFeatures();
      }
    } catch (err) {
      console.error("❌ Error loading user data:", err);
      alert("Error loading the requested portfolio.");
      // Optionally redirect back home
      window.location.href = "home.html";
    }
  }

  loadUserData();

  // 4) Implement logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('loginExpiry');
      window.location.href = '/login.html';
    });
  }

  // Utility function to hide all add/edit/delete controls
  function hideEditFeatures() {
    // Hide "Edit Bio", "Add Skill/Project", and skill/project edit/delete
    const toHide = document.querySelectorAll(
      '#btn-edit-bio, #btn-add-skill, #btn-add-project, ' +
      '.btn-edit-skill, .btn-delete-skill, .btn-edit-project, .btn-delete-project'
    );
    toHide.forEach(el => el.style.display = 'none');
  }

  // 5) Fill the existing design with user data
  function fillUserProfile(user) {
    // "Hello I'm"
    document.getElementById('User-name').textContent = user.fullName || 'User';

    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
      profileImg.src = user.profile_img || 'images/default.jpg';
      profileImg.alt = user.fullName || 'User';
    }

    // About
    const aboutBody = document.getElementById('about-body');
    if (aboutBody) aboutBody.textContent = user.about_desc || '';

    // Contact
    const emailEl = document.getElementById('email-id');
    if (emailEl) emailEl.textContent = user.email || '';
    const phoneEl = document.getElementById('phone-id');
    if (phoneEl) phoneEl.textContent = user.phone || '';

    // Skills revolve
    renderSkillsRevolve(user.skills || []);
    // Projects revolve
    renderProjectsRevolve(user.projects || []);
  }

  // Next: skill revolve, project revolve, etc. exactly as you had
  // (the rest of your skill add/edit/delete logic is unchanged
  //  but we won't forcibly redirect if it's not the same user.)

  // 6) The same skill revolve code
  function renderSkillsRevolve(skills) {
    const container = document.getElementById('skills-revolver-content');
    container.innerHTML = '';
    skills.forEach((skill, idx) => {
      const div = document.createElement('div');
      div.classList.add('content-item');
      div.innerHTML = `
        <h2 class="content-title">${skill.title}</h2>
        <p class="content-description">${skill.description || ''}</p>
        <button class="btn-edit-skill" data-index="${idx}">Edit</button>
        <button class="btn-delete-skill" data-index="${idx}">Delete</button>
      `;
      container.appendChild(div);
    });
  }

  // 7) Button for adding new skill
  const addSkillBtn = document.getElementById('btn-add-skill');
  if (addSkillBtn) {
    addSkillBtn.addEventListener('click', async () => {
      if (!currentUser) return;
      const title = prompt('Skill Title:');
      if (title === null) return;
      const description = prompt('Skill Description:');
      if (description === null) return;
      try {
        const res = await fetch(`/api/users/${currentUser._id}/skills`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description })
        });
        const updatedUser = await res.json();
        if (res.ok) {
          currentUser = updatedUser;
          renderSkillsRevolve(currentUser.skills);
          alert('Skill added!');
        } else {
          alert('Error adding skill: ' + (updatedUser.message || 'Unknown'));
        }
      } catch (err) {
        console.error(err);
        alert('Error adding skill');
      }
    });
  }

  // 8) Skills revolve container for edit/delete
  const skillContainer = document.getElementById('skills-revolver-content');
  if (skillContainer) {
    skillContainer.addEventListener('click', async (e) => {
      if (!currentUser) return;
      const idx = e.target.getAttribute('data-index');
      if (idx === null) return;
      const skillId = currentUser.skills[idx]._id;

      // Edit skill
      if (e.target.classList.contains('btn-edit-skill')) {
        const newTitle = prompt('New skill title:', currentUser.skills[idx].title);
        if (newTitle === null) return;
        const newDesc = prompt('New skill description:', currentUser.skills[idx].description);
        if (newDesc === null) return;
        try {
          const res = await fetch(`/api/users/${currentUser._id}/skills/${skillId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, description: newDesc })
          });
          const updatedUser = await res.json();
          if (res.ok) {
            currentUser = updatedUser;
            renderSkillsRevolve(currentUser.skills);
            alert('Skill updated!');
          } else {
            alert('Error updating skill: ' + (updatedUser.message || 'Unknown'));
          }
        } catch (err) {
          console.error(err);
          alert('Error updating skill');
        }
      }

      // Delete skill
      if (e.target.classList.contains('btn-delete-skill')) {
        if (!confirm('Are you sure you want to delete this skill?')) return;
        try {
          const res = await fetch(`/api/users/${currentUser._id}/skills/${skillId}`, {
            method: 'DELETE'
          });
          const updatedUser = await res.json();
          if (res.ok) {
            currentUser = updatedUser;
            renderSkillsRevolve(currentUser.skills);
            alert('Skill deleted!');
          } else {
            alert('Error deleting skill: ' + (updatedUser.message || 'Unknown'));
          }
        } catch (err) {
          console.error(err);
          alert('Error deleting skill');
        }
      }
    });
  }
   
  // 9. Change profile picture
  const picInput = document.getElementById("change-pic-input");
  if (picInput) {
    picInput.addEventListener("change", async function () {
      const file = this.files[0];
      if (!file || !currentUser) return;
  
      const formData = new FormData();
      formData.append("profile_img", file);
  
      try {
        const res = await fetch(`/api/users/${currentUser._id}/profile-pic`, {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const text = await res.text(); // ← avoid trying to parse as JSON on error
          throw new Error("Server returned error: " + text);
        }
  
        const updated = await res.json();
        if (res.ok) {
          document.querySelector(".profile-img").src = updated.profile_img;
          alert("✅ Profile picture updated!");
        } else {
          alert("❌ Failed to update profile picture.");
        }
      } catch (err) {
        console.error("❌ Error uploading profile image:", err);
        alert("Error during upload.");
      }
    });
  }
  











  // 9) Projects revolve
  function renderProjectsRevolve(projects) {
    const container = document.getElementById('projects-revolver-content');
    container.innerHTML = '';
    projects.forEach((proj, idx) => {
      const div = document.createElement('div');
      div.classList.add('project-item');
      div.innerHTML = `
        <img src="${proj.photo || 'images/proj1.png'}" class="project-image" alt="proj">
        <h2 class="project-title">${proj.title}</h2>
        <p class="project-description">${proj.description || ''}</p>
        <button class="btn-edit-project" data-index="${idx}">Edit</button>
        <button class="btn-delete-project" data-index="${idx}">Delete</button>
      `;
      container.appendChild(div);
    });
  }

  // 10) Add new project
  const addProjectBtn = document.getElementById('btn-add-project');
  if (addProjectBtn) {
    addProjectBtn.addEventListener('click', async () => {
      if (!currentUser) return;
      const title = prompt('Project Title:');
      if (title === null) return;
      const description = prompt('Project Description:');
      if (description === null) return;
      const photo = prompt('Project Photo URL (optional):', '');
      if (photo === null) return;
      try {
        const res = await fetch(`/api/users/${currentUser._id}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, photo })
        });
        const updatedUser = await res.json();
        if (res.ok) {
          currentUser = updatedUser;
          renderProjectsRevolve(currentUser.projects);
          alert('Project added!');
        } else {
          alert('Error adding project: ' + (updatedUser.message || 'Unknown'));
        }
      } catch (err) {
        console.error(err);
        alert('Error adding project');
      }
    });
  }

  // 11) Edit/Delete project
  const projectContainer = document.getElementById('projects-revolver-content');
  if (projectContainer) {
    projectContainer.addEventListener('click', async (e) => {
      if (!currentUser) return;
      const idx = e.target.getAttribute('data-index');
      if (idx === null) return;
      const projectId = currentUser.projects[idx]._id;

      // Edit
      if (e.target.classList.contains('btn-edit-project')) {
        const newTitle = prompt('New project title:', currentUser.projects[idx].title);
        if (newTitle === null) return;
        const newDesc = prompt('New project description:', currentUser.projects[idx].description);
        if (newDesc === null) return;
        const newPhoto = prompt('New photo URL (optional):', currentUser.projects[idx].photo || '');
        if (newPhoto === null) return;

        try {
          const res = await fetch(`/api/users/${currentUser._id}/projects/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, description: newDesc, photo: newPhoto })
          });
          const updatedUser = await res.json();
          if (res.ok) {
            currentUser = updatedUser;
            renderProjectsRevolve(currentUser.projects);
            alert('Project updated!');
          } else {
            alert('Error updating project: ' + (updatedUser.message || 'Unknown'));
          }
        } catch (err) {
          console.error(err);
          alert('Error updating project');
        }
      }

      // Delete
      if (e.target.classList.contains('btn-delete-project')) {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
          const res = await fetch(`/api/users/${currentUser._id}/projects/${projectId}`, {
            method: 'DELETE'
          });
          const updatedUser = await res.json();
          if (res.ok) {
            currentUser = updatedUser;
            renderProjectsRevolve(currentUser.projects);
            alert('Project deleted!');
          } else {
            alert('Error deleting project: ' + (updatedUser.message || 'Unknown'));
          }
        } catch (err) {
          console.error(err);
          alert('Error deleting project');
        }
      }
    });
  }

});
