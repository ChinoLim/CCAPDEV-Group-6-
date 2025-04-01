"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var currentProjectIndex = 0;

  function projectScrollLeft() {
    var content = document.getElementById('Acontent');
    var items = content.children;
    var itemWidth = items[0].offsetWidth;

    if (currentProjectIndex > 0) {
      currentProjectIndex--;
    } else {
      currentProjectIndex = items.length - 1;
    }

    content.style.transform = "translateX(-".concat(itemWidth * currentProjectIndex, "px)");
    console.log('Scroll Left:', currentProjectIndex);
  }

  function projectScrollRight() {
    var content = document.getElementById('Acontent');
    var items = content.children;
    var itemWidth = items[0].offsetWidth;

    if (currentProjectIndex < items.length - 1) {
      currentProjectIndex++;
    } else {
      currentProjectIndex = 0;
    }

    content.style.transform = "translateX(-".concat(itemWidth * currentProjectIndex, "px)");
    console.log('Scroll Right:', currentProjectIndex);
  }

  document.getElementById('AprevButton').onclick = projectScrollLeft;
  document.getElementById('AnextButton').onclick = projectScrollRight;
});