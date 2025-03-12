document.addEventListener("DOMContentLoaded", async () => {
    const skillsContainer = document.getElementById("skills-forms");
    const projectsContainer = document.getElementById("projects-forms");

    async function fetchData() {
        try {
            const response = await fetch("/api/users");
            const users = await response.json();
            console.log("Fetched users:", users); // Debugging line
    
            if (!Array.isArray(users) || users.length === 0) {
                console.warn("No users found in the database.");
                return;
            }
    
            const skillsList = document.getElementById("skills-list");
            const projectsList = document.getElementById("projects-list");
    
            skillsList.innerHTML = "";
            projectsList.innerHTML = "";
    
            users.forEach(user => {
                user.skills.forEach(skill => {
                    console.log("Adding skill:", skill); // Debugging
                    skillsList.appendChild(createSkillElement(skill, user._id));
                });
    
                user.projects.forEach(project => {
                    console.log("Adding project:", project); // Debugging
                    projectsList.appendChild(createProjectElement(project, user._id));
                });
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function createSkillElement(skill, userId) {
        const skillDiv = document.createElement("div");
        skillDiv.className = "skill-item";
        skillDiv.innerHTML = `
            <input type="text" value="${skill.title}" class="skill-title">
            <textarea class="skill-description">${skill.description}</textarea>
            <button onclick="updateSkill('${userId}', '${skill.title}', this)">Save</button>
            <button onclick="deleteSkill('${userId}', '${skill.title}')">Delete</button>
        `;
        return skillDiv;
    }

    function createProjectElement(project, userId) {
        const projectDiv = document.createElement("div");
        projectDiv.className = "project-item";
        projectDiv.innerHTML = `
            <input type="text" value="${project.title}" class="project-title">
            <textarea class="project-description">${project.description}</textarea>
            <input type="file" class="project-photo">
            <img src="${project.photo}" alt="Project Image" class="project-preview">
            <button onclick="updateProject('${userId}', '${project.title}', this)">Save</button>
            <button onclick="deleteProject('${userId}', '${project.title}')">Delete</button>
        `;
        return projectDiv;
    }

    window.updateSkill = async (userId, oldTitle, button) => {
        const skillDiv = button.parentElement;
        const newTitle = skillDiv.querySelector(".skill-title").value;
        const description = skillDiv.querySelector(".skill-description").value;
        
        await fetch(`/api/users/${userId}/skills`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldTitle, newTitle, description })
        });
        fetchData();
    };

    window.deleteSkill = async (userId, title) => {
        await fetch(`/api/users/${userId}/skills/${title}`, { method: "DELETE" });
        fetchData();
    };

    window.updateProject = async (userId, oldTitle, button) => {
        const projectDiv = button.parentElement;
        const newTitle = projectDiv.querySelector(".project-title").value;
        const description = projectDiv.querySelector(".project-description").value;
        const fileInput = projectDiv.querySelector(".project-photo");
        
        const formData = new FormData();
        formData.append("oldTitle", oldTitle);
        formData.append("newTitle", newTitle);
        formData.append("description", description);
        if (fileInput.files.length) {
            formData.append("photo", fileInput.files[0]);
        }

        await fetch(`/api/users/${userId}/projects`, {
            method: "PUT",
            body: formData
        });
        fetchData();
    };

    window.deleteProject = async (userId, title) => {
        await fetch(`/api/users/${userId}/projects/${title}`, { method: "DELETE" });
        fetchData();
    };

    fetchData();
});
