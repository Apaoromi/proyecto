
document.addEventListener("DOMContentLoaded", function () {
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
  const linkUsuario = document.getElementById("link-usuario");
  

    /*
    if (usuarioGuardado && linkUsuario) {
    // Cambiar texto y comportamiento
    linkUsuario.textContent = usuarioGuardado.usuario + " (Salir)";
    linkUsuario.href = "#";
    linkUsuario.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("usuario");
      window.location.href = "login.html";
    });
    */
   
});
window.addEventListener("DOMContentLoaded", () => {
  // Crear elemento
  const floatingCart = document.createElement("a");
  floatingCart.href = "cart.html";     // destino al hacer click
  floatingCart.setAttribute("aria-label", "Ir al carrito");
  floatingCart.innerHTML = "🛒";       // icono (puedes cambiar por SVG)
  floatingCart.id = "floating-cart";

  // Estilos (todo con JS, no hace falta CSS externo)
  Object.assign(floatingCart.style, {
    position: "fixed",    // <-- esto hace que siga al scrollear
    bottom: "20px",
    right: "20px",
    width: "56px",
    height: "56px",
    background: "#ff6f61",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "26px",
    textDecoration: "none",
    boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
    zIndex: "9999",
    transition: "transform .15s ease, background .15s",
    cursor: "pointer",
    userSelect: "none",
  });

  // Hover (no :hover posible directo, así que se hace con eventos)
  floatingCart.addEventListener("mouseenter", () => {
    floatingCart.style.transform = "scale(1.08)";
    floatingCart.style.background = "#ff3b2f";
  });
  floatingCart.addEventListener("mouseleave", () => {
    floatingCart.style.transform = "scale(1)";
    floatingCart.style.background = "#ff6f61";
  });

  // (Opcional) Badge con cantidad de productos en localStorage (key "carrito" = array de ids)
  const badge = document.createElement("span");
  badge.id = "floating-cart-badge";
  Object.assign(badge.style, {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    minWidth: "20px",
    padding: "2px 6px",
    borderRadius: "999px",
    background: "#222",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "700",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
  });
  floatingCart.style.position = "fixed"; // asegurar posicion relativa al viewport
  floatingCart.appendChild(badge);

  // Función para actualizar badge
  function actualizarBadge() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const qty = carrito.length;
    if (qty > 0) {
      badge.style.display = "flex";
      badge.textContent = qty;
    } else {
      badge.style.display = "none";
    }
  }

  // Actualizar al cargar y al cambiar carrito (si cambiás el carrito por otro script, llamar actualizarBadge)
  actualizarBadge();

  // Insertar en el DOM
  document.body.appendChild(floatingCart);

  // Si querés que el badge se actualice automáticamente cuando cambie localStorage desde otra pestaña:
  window.addEventListener("storage", (e) => {
    if (e.key === "carrito") actualizarBadge();
  });
});
