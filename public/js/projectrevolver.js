document.addEventListener('DOMContentLoaded', () => {
  const projectRevolver = document.querySelector('.project-revolver');
  const btnPrev = document.getElementById('project-prev');
  const btnNext = document.getElementById('project-next');

  if (projectRevolver && btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      projectRevolver.scrollBy({
        left: -projectRevolver.clientWidth,
        behavior: 'smooth'
      });
    });

    btnNext.addEventListener('click', () => {
      projectRevolver.scrollBy({
        left: projectRevolver.clientWidth,
        behavior: 'smooth'
      });
    });
  } else {
    console.warn("🛑 One or more project elements not found");
  }
});
