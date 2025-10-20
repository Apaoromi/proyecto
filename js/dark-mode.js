// dark-mode.js
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  
  const toggleLabel = document.querySelector('.toggle-label');
  if (toggleLabel) {
    toggleLabel.textContent = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
  }
}

function loadTheme() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  
  if (darkMode) {
    document.body.classList.add('dark-mode');
    const toggleLabel = document.querySelector('.toggle-label');
    if (toggleLabel) {
      toggleLabel.textContent = 'Modo Claro';
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadTheme();
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
});