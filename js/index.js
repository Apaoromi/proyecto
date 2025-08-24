document.addEventListener("DOMContentLoaded", function() {
    const usuarioGuardado = localStorage.getItem("usuario");

    // Si no hay usuario guardado -> mandarlo al login
    if (!usuarioGuardado) {
        window.location.href = "login.html";
    }

    // ---- Lo que ya tenías ----
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
});
