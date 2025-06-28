document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById('menuToggle');
  const menuContent = document.getElementById('menuContent');

  menuToggle.addEventListener('click', function () {
    const isVisible = menuContent.style.display === 'block';
    menuContent.style.display = isVisible ? 'none' : 'block';
  });
});
