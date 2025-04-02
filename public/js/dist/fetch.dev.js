"use strict";

document.addEventListener('DOMContentLoaded', function _callee() {
  var identifier, response, user, skillContainer, projectContainer;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          identifier = window.location.pathname.substring(1);
          console.log("🔍 Extracted identifier from URL:", identifier);

          if (identifier) {
            _context.next = 6;
            break;
          }

          console.warn("⚠️ No user identifier found in URL");
          document.getElementById("about-body").textContent = "User not found!";
          return _context.abrupt("return");

        case 6:
          _context.prev = 6;
          _context.next = 9;
          return regeneratorRuntime.awrap(fetch("http://localhost:3000/api/users/".concat(encodeURIComponent(identifier))));

        case 9:
          response = _context.sent;

          if (response.ok) {
            _context.next = 12;
            break;
          }

          throw new Error("User not found");

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(response.json());

        case 14:
          user = _context.sent;
          console.log("Fetched user data:", user);
          document.getElementById("User-name").textContent = user.full_name;
          document.getElementById("about-body").textContent = user.about_desc;
          document.querySelector(".profile-img").src = user.profile_img;
          document.getElementById("email-id").textContent = user.email;
          document.getElementById("phone-id").textContent = user.phone_number;
          skillContainer = document.getElementById("content");
          skillContainer.innerHTML = "";
          user.skills.forEach(function (skill) {
            skillContainer.innerHTML += "\n                <div class=\"content-item\">\n                    <h2 class=\"content-title\">".concat(skill.title, "</h2>\n                    <p class=\"content-description\">").concat(skill.description, "</p>\n                </div>\n            ");
          });
          projectContainer = document.getElementById("Acontent");
          projectContainer.innerHTML = "";
          user.projects.forEach(function (project) {
            projectContainer.innerHTML += "\n                <div class=\"project-item\">\n                    <img src=\"".concat(project.photo, "\" class=\"project-image\" alt=\"").concat(project.photo, "\">\n                    <h2 class=\"project-title\">").concat(project.title, "</h2>\n                    <p class=\"project-description\">").concat(project.description, "</p>\n                </div>\n            ");
          });
          _context.next = 33;
          break;

        case 29:
          _context.prev = 29;
          _context.t0 = _context["catch"](6);
          console.error("Error loading user data:", _context.t0);
          document.getElementById("about-body").textContent = "User not found!";

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 29]]);
});