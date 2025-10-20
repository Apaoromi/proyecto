document.addEventListener("DOMContentLoaded", function () {
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

  // Redirigir si no está logueado
  if (!usuarioGuardado) {
    window.location.href = "login.html";
    return;
  }

  // Navegación categorías
  document.getElementById("autos").addEventListener("click", function () {
    localStorage.setItem("catID", 101);
    window.location = "products.html";
  });
  document.getElementById("juguetes").addEventListener("click", function () {
    localStorage.setItem("catID", 102);
    window.location = "products.html";
  });
  document.getElementById("muebles").addEventListener("click", function () {
    localStorage.setItem("catID", 103);
    window.location = "products.html";
  });

  // Link usuario
  const linkUsuario = document.getElementById("link-usuario");
  if (usuarioGuardado && linkUsuario) {
    linkUsuario.textContent = usuarioGuardado.usuario + " (Mi perfil)";
    linkUsuario.href = "#";
    linkUsuario.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "my-profile.html";
    });
  }
});

// ✅ --- SWITCH DE TEMA SIEMPRE ACTIVO, FUERA DEL RETURN ---
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const toggleLabel = document.querySelector(".toggle-label");
  const body = document.body;

  if (!themeToggle) return; // Si no existe el toggle, no hacer nada

  // Cargar tema guardado
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    toggleLabel.textContent = "Modo Claro";
  } else {
    toggleLabel.textContent = "Modo Oscuro";
  }

  // Evento toggle
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
      toggleLabel.textContent = "Modo Claro";
    } else {
      localStorage.setItem("theme", "light");
      toggleLabel.textContent = "Modo Oscuro";
    }
  });
});
