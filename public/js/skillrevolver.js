document.addEventListener('DOMContentLoaded', () => {
  const revolver = document.querySelector('.revolver');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');

  // Scroll one "view width" on each click
  prevButton.addEventListener('click', () => {
    revolver.scrollBy({
      left: -revolver.clientWidth,
      behavior: 'smooth'
    });
  });

  // Smooth scroll to next skill
  nextButton.addEventListener('click', () => {
    revolver.scrollBy({
      left: revolver.clientWidth,
      behavior: 'smooth'
    });
  });
});