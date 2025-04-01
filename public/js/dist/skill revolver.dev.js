"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var currentSkillIndex = 0;

  function skillScrollLeft() {
    var content = document.getElementById('content');
    var items = content.children;
    var itemWidth = items[0].offsetWidth;

    if (currentSkillIndex > 0) {
      currentSkillIndex--;
    } else {
      currentSkillIndex = items.length - 1;
    }

    content.style.transform = "translateX(-".concat(itemWidth * currentSkillIndex, "px)");
    console.log('Scroll Left:', currentSkillIndex);
  }

  function skillScrollRight() {
    var content = document.getElementById('content');
    var items = content.children;
    var itemWidth = items[0].offsetWidth;

    if (currentSkillIndex < items.length - 1) {
      currentSkillIndex++;
    } else {
      currentSkillIndex = 0;
    }

    content.style.transform = "translateX(-".concat(itemWidth * currentSkillIndex, "px)");
    console.log('Scroll Right:', currentSkillIndex);
  }

  document.getElementById('prevButton').onclick = skillScrollLeft;
  document.getElementById('nextButton').onclick = skillScrollRight;
});