// public/js/fetch.js
// public/js/fetch.js


console.log("✅ fetch.js is loaded");

document.addEventListener('DOMContentLoaded', async () => {
  console.log("✅ DOM loaded");

  const pathUsername = window.location.pathname.replace('/', '').toLowerCase();
  const loggedInUsername = localStorage.getItem('loggedInUser');

  console.log("🔎 pathUsername =", pathUsername);
  console.log("🔎 loggedInUsername =", loggedInUsername);

  const res = await fetch(`/api/users/${loggedInUsername}`);
  const user = await res.json();
  console.log("✅ fetched user:", user);

  // test if elements are found
  console.log("User-name found:", document.getElementById('User-name'));
});


document.addEventListener('DOMContentLoaded', () => {
  let currentUser = null;

  // ✅ Get the username from the URL path (e.g., /johndoe)
  const pathUsername = window.location.pathname.replace('/', '').toLowerCase();

  // ✅ Get the logged-in user from localStorage
  const loggedInUsername = localStorage.getItem('loggedInUser');

  // 🚫 If no one is logged in, redirect to login
  if (!loggedInUsername) {
    alert("You must be logged in to view a portfolio.");
    window.location.href = '/login.html';
    return;
  }

  // 🚫 If logged-in user tries to access someone else's page
  if (pathUsername !== loggedInUsername.toLowerCase()) {
    alert("You can only access your own portfolio.");
    window.location.href = `/${loggedInUsername}`;
    return;
  }

  // ✅ Proceed to load the correct user’s data
  async function loadUserData() {
    try {
      const res = await fetch(`/api/users/${loggedInUsername}`);
      if (!res.ok) throw new Error(`User not found: ${loggedInUsername}`);
      currentUser = await res.json();
      window.currentUser = currentUser;
      fillUserProfile(currentUser);
    } catch (err) {
      console.error('Error loading user data:', err);
      alert('Error loading your portfolio data.');
    }
  }

  // 4) Implement the logout function
function logout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('loginExpiry');
  window.location.href = '/login.html';
}

// 5) Hook up the logout button (safely)
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}




  // 3) Fill the existing design with user data
  function fillUserProfile(user) {
    // "Hello I'm" 
    document.getElementById('User-name').textContent = user.fullName || 'User';

    const profileImg = document.querySelector('.profile-img');
    profileImg.src = user.profile_img || 'images/default.jpg'; // fallback if empty
    profileImg.alt = user.fullName || 'User';

    document.getElementById('about-body').textContent = user.about_desc || '';
    // Contact
    document.getElementById('email-id').textContent = user.email || '';
    document.getElementById('phone-id').textContent = user.phone || '';
    // Skills revolve
    renderSkillsRevolve(user.skills);
    // Projects revolve
    renderProjectsRevolve(user.projects);
  }

  // 4) Add "Edit Bio" button logic
  const editBioBtn = document.getElementById('btn-edit-bio');
if (editBioBtn) {
  editBioBtn.addEventListener('click', async () => {
    if (!currentUser) return;
    const newBio = prompt('Enter new bio:', currentUser.about_desc || '');
    if (newBio === null) return; // user cancelled
    try {
      const response = await fetch(`/api/users/${currentUser._id}/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ about_desc: newBio })
      });
      const updatedUser = await response.json();
      if (response.ok) {
        currentUser = updatedUser;
        document.getElementById('about-body').textContent = currentUser.about_desc;
        alert('Bio updated!');
      } else {
        alert('Error updating bio: ' + (updatedUser.message || 'Unknown'));
      }
    } catch (err) {
      console.error(err);
      alert('Error updating bio');
    }
  });
}


  // 5) Skills revolve
  function renderSkillsRevolve(skills) {
    const container = document.getElementById('skills-revolver-content');
    container.innerHTML = '';
    skills.forEach((skill, idx) => {
      const div = document.createElement('div');
      div.classList.add('skill-card');
      div.setAttribute('data-index', idx);
      div.innerHTML = `
        <h2 class="content-title">${skill.title}</h2>
        <p class="content-description">${skill.description || ''}</p>
        <button class="btn-edit-skill">Edit</button>
        <button class="btn-delete-skill">Delete</button>`;
      container.appendChild(div);
    });
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
    // Optionally, show only one skill at a time, etc. (skillrevolver.js)
  }

  // Add new skill
  document.getElementById('btn-add-skill').addEventListener('click', async () => {
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

  // Edit / Delete skill
  document.getElementById('skills-revolver-content').addEventListener('click', async (e) => {
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

  // 6) Projects revolve
  function renderProjectsRevolve(projects) {
    const container = document.getElementById('projects-revolver-content');
    container.innerHTML = '';
    projects.forEach((proj, idx) => {
      const div = document.createElement('div');
      div.classList.add('project-card');
      div.setAttribute('data-index', idx);
      div.innerHTML = `
        <img src="${proj.photo || 'images/proj1.png'}" class="project-image" alt="proj">
        <h2 class="project-title">${proj.title}</h2>
        <p class="project-description">${proj.description || ''}</p>
        <button class="btn-edit-project">Edit</button>
        <button class="btn-delete-project">Delete</button>`;
      container.appendChild(div);
    });
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
    // Similarly, you can revolve them in projectrevolver.js
  }

  // Add new project
  document.getElementById('btn-add-project').addEventListener('click', async () => {
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

  // Edit / Delete project
  document.getElementById('projects-revolver-content').addEventListener('click', async (e) => {
    if (!currentUser) return;
    const idx = e.target.getAttribute('data-index');
    if (idx === null) return;
    const projectId = currentUser.projects[idx]._id;

    // Edit project
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

    // Delete project
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

  // Load user data on page load
  loadUserData();


  
});
