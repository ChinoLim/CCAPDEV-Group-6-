document.addEventListener('DOMContentLoaded', function() {
    // Project Revolution
    let currentProjectIndex = 0;
  
    function projectScrollLeft() {
      const content = document.getElementById('Acontent');
      const items = content.children;
      const itemWidth = items[0].offsetWidth;
      if (currentProjectIndex > 0) {
        currentProjectIndex--;
      } else {
        currentProjectIndex = items.length - 1;
      }
      content.style.transform = `translateX(-${itemWidth * currentProjectIndex}px)`;
      console.log('Scroll Left:', currentProjectIndex);
    }
  
    function projectScrollRight() {
      const content = document.getElementById('Acontent');
      const items = content.children;
      const itemWidth = items[0].offsetWidth;
      if (currentProjectIndex < items.length - 1) {
        currentProjectIndex++;
      } else {
        currentProjectIndex = 0;
      }
      content.style.transform = `translateX(-${itemWidth * currentProjectIndex}px)`;
      console.log('Scroll Right:', currentProjectIndex);
    }
  
    document.getElementById('AprevButton').onclick = projectScrollLeft;
    document.getElementById('AnextButton').onclick = projectScrollRight;
});