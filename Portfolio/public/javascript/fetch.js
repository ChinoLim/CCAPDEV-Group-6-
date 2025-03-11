document.addEventListener('DOMContentLoaded', async function () {
    let identifier = window.location.pathname.substring(1);
    console.log("🔍 Extracted identifier from URL:", identifier);

    if (!identifier) {
        console.warn("⚠️ No user identifier found in URL");
        document.getElementById("about-body").textContent = "User not found!";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/users/${encodeURIComponent(identifier)}`);
        if (!response.ok) throw new Error("User not found");

        const user = await response.json();
        console.log("Fetched user data:", user);

        document.getElementById("User-name").textContent = user.full_name;
        document.getElementById("about-body").textContent = user.about_desc;
        document.querySelector(".profile-img").src = user.profile_img;
        document.getElementById("email-id").textContent = user.email;
        document.getElementById("phone-id").textContent = user.phone_number;

        const skillContainer = document.getElementById("content");
        skillContainer.innerHTML = "";
        user.skills.forEach(skill => {
            skillContainer.innerHTML += `
                <div class="content-item">
                    <h2 class="content-title">${skill.title}</h2>
                    <p class="content-description">${skill.description}</p>
                </div>
            `;
        });

        const projectContainer = document.getElementById("Acontent");
        projectContainer.innerHTML = "";
        user.projects.forEach(project => {
            projectContainer.innerHTML += `
                <div class="project-item">
                    <img src="${project.photo}" class="project-image" alt="${project.photo}">
                    <h2 class="project-title">${project.title}</h2>
                    <p class="project-description">${project.description}</p>
                </div>
            `;
        });

    } catch (error) {
        console.error("Error loading user data:", error);
        document.getElementById("about-body").textContent = "User not found!";
    }
});
