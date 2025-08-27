document.addEventListener("DOMContentLoaded", function () {
  const usuarioGuardado = localStorage.getItem("usuario");
  const linkUsuario = document.getElementById("link-usuario");


  if (usuarioGuardado && linkUsuario) {
    // Cambiar texto y comportamiento
    linkUsuario.textContent = usuarioGuardado + " (Salir)";
    linkUsuario.href = "#";
    linkUsuario.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("usuario");
      window.location.href = "login.html";
    });
  }
});
