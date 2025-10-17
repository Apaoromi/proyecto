document.addEventListener("DOMContentLoaded", function() {
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

    // Solo redirigir si intentan entrar al index sin usuario
    if (!usuarioGuardado) {

        window.location.href = "login.html";
        return; 
    }

    
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html";
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html";
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html";
    });


  const linkUsuario = document.getElementById("link-usuario");


    
  if (usuarioGuardado && linkUsuario) {
    // Cambiar texto y comportamiento
    linkUsuario.textContent = usuarioGuardado.usuario + " (Mi perfil)";
    linkUsuario.href = "#";
    linkUsuario.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "my-profile.html";
    });
  }
    
});