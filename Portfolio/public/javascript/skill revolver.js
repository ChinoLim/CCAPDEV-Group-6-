document.addEventListener('DOMContentLoaded', function() {
let currentSkillIndex = 0;
  function skillScrollLeft() {
    const content = document.getElementById('content');
    const items = content.children;
    const itemWidth = items[0].offsetWidth;
    if (currentSkillIndex > 0) {
      currentSkillIndex--;
    } else {
      currentSkillIndex = items.length - 1;
    }
    content.style.transform = `translateX(-${itemWidth * currentSkillIndex}px)`;
    console.log('Scroll Left:', currentSkillIndex);
  }

  function skillScrollRight() {
    const content = document.getElementById('content');
    const items = content.children;
    const itemWidth = items[0].offsetWidth;
    if (currentSkillIndex < items.length - 1) {
      currentSkillIndex++;
    } else {
      currentSkillIndex = 0;
    }
    content.style.transform = `translateX(-${itemWidth * currentSkillIndex}px)`;
    console.log('Scroll Right:', currentSkillIndex);
  }

  document.getElementById('prevButton').onclick = skillScrollLeft;
  document.getElementById('nextButton').onclick = skillScrollRight;
});