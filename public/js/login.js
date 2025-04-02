// login.js
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) {
      console.error("loginForm not found!");
      return;
    }
  
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent page reload
  
      const usernameInput = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
  
      if (!usernameInput || !password) {
        alert("❌ Please enter both username and password.");
        return;
      }
  
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: usernameInput, password })
        });
  
        const result = await response.json();
  
        if (result.success) {
          alert("✅ Login successful!");
          // Save the actual username returned by the server (in lowercase)
          sessionStorage.setItem("loggedInUser", result.actualUsername);
          document.cookie = "hasSession=true; path=/";

          // Redirect to the user's portfolio page (e.g., /johndoe)
          window.location.href = "home.html";
        } else {
          alert("❌ Login failed: " + result.message);
        }
      } catch (error) {
        console.error("❌ Error logging in:", error);
        alert("❌ Server error. Please try again later.");
      }
    });
  });
  