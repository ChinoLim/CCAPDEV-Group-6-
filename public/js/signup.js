
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    


    const emailErr = document.getElementById("email-error");
    const usernameErr = document.getElementById("username-error");
    const phoneErr = document.getElementById("phone-error");
    const passErr = document.getElementById("password-error");
    const confirmErr = document.getElementById("confirm-error");
 

    emailErr.style.display = usernameErr.style.display = passErr.style.display = confirmErr.style.display = "none";

    if (!email.includes("@")) {
      emailErr.style.display = "inline";
      return;
    }
    if (username.length < 3) {
      usernameErr.style.display = "inline";
      return;
    }
    if (phone.length < 6) {
      phoneErr.style.display = "inline";
      return;
    }
    if (password.length < 6) {
      passErr.style.display = "inline";
      return;
    }
    if (password !== confirmPassword) {
      confirmErr.style.display = "inline";
      return;
    }

    const newUser = { email, username, password, phone };

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      });

      const result = await res.json();
      if (res.ok) {
        alert("Signup successful! Please login.");
        window.location.href = "login.html";
      } else {
        alert("Signup failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again later.");
    }
  });
});
