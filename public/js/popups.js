function openPopup(id) {
  document.getElementById(id).style.display = 'block';
  document.getElementById('overlay').style.display = 'block';
}

function closePopup(id) {
  document.getElementById(id).style.display = 'none';
  checkOverlay();
}

function closeAllPopups() {
  const popups = document.querySelectorAll('.email-pop, .phone-pop');
  popups.forEach(popup => popup.style.display = 'none');
  document.getElementById('overlay').style.display = 'none';
}

function checkOverlay() {
  const popups = document.querySelectorAll('.email-pop, .phone-pop');
  const isAnyPopupOpen = Array.from(popups).some(popup => popup.style.display === 'block');
  document.getElementById('overlay').style.display = isAnyPopupOpen ? 'block' : 'none';
}
