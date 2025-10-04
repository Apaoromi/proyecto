// Obtener el ID del producto desde localStorage
const productID = localStorage.getItem("prodID");
console.log("ProdID:", productID);

// Obtener el usuario guardado en localStorage
const usuarioGuardado = localStorage.getItem("usuario");

// Construir la URL de la API para la info del producto
const apiURL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

// Contenedor de info del producto
const container = document.getElementById("container-info");

// Contenedor de comentarios
const comentariosContainer = document.getElementById("lista-comentarios");

const btnEnviar = document.getElementById("btn-comentario");

// Select de ordenar
const selectOrden = document.getElementById("orden");

let comentarios = [];

// ===============================
// 1) Cargar la info del producto
// ===============================
fetch(apiURL)
  .then(response => response.json())
  .then(product => {
    const html = `
      <div class="product-page">
        <div class="product-detail">
          <h2 class="detail-title">${product.name}</h2>
          <div class="detail-image-container">
            <img src="${product.images[0]}" alt="${product.name}" class="detail-image">
          </div>
          <div class="detail-info">
            <p><strong>Descripción:</strong> ${product.description}</p>
            <p><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
            <p><strong>Vendidos:</strong> ${product.soldCount}</p>
            <p><strong>Categoría:</strong> ${product.category}</p>
          </div>
        </div>
      </div>
    `;
    container.innerHTML = html;
  })
  .catch(error => {
    console.error("Error cargando el producto:", error);
    container.innerHTML = "<p>No se pudo cargar la información del producto.</p>";
  });

// ===============================
// 2) Cargar comentarios
// ===============================
function obtenerComentarios() {
  fetch(`https://japceibal.github.io/emercado-api/products_comments/${productID}.json`)
    .then(res => res.json())
    .then(data => {
      comentarios = data;

      // Traer los guardados en localStorage
      const guardados = JSON.parse(localStorage.getItem("comentarios_" + productID)) || [];
      comentarios = comentarios.concat(guardados);

      // Orden inicial: más recientes
      ordenarComentarios("fecha_desc");
    });
}

// ===============================
// 3) Mostrar comentarios
// ===============================
function mostrarComentarios(lista) {
  comentariosContainer.innerHTML = lista.map(c => `
    <div class="comentario">
      <strong>${c.user}</strong> - ${c.dateTime}<br>
      ${"★".repeat(c.score)}${"☆".repeat(5 - c.score)}<br>
      ${c.description}
    </div>
  `).join("");
}

// ===============================
// 3.1) Ordenar comentarios
// ===============================
function ordenarComentarios(criterio) {
  let ordenados = [...comentarios];

  switch (criterio) {
    case "fecha_desc":
      ordenados.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
      break;
    case "fecha_asc":
      ordenados.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      break;
    case "puntuacion_desc":
      ordenados.sort((a, b) => b.score - a.score);
      break;
    case "puntuacion_asc":
      ordenados.sort((a, b) => a.score - b.score);
      break;
  }

  mostrarComentarios(ordenados);
}

// ===============================
// 4) Guardar nuevo comentario
// ===============================
document.addEventListener("submit", guardarComentario);

function guardarComentario(e) {
  e.preventDefault();

  const stars = document.querySelector('input[name="stars"]:checked');
  const comment = e.target.comentario.value;

  if (!stars) {
    alert("Por favor selecciona una cantidad de estrellas.");
    return;
  }

  const nuevoComentario = {
    product: productID,
    score: parseInt(stars.value),
    description: comment,
    user: usuarioGuardado,
    dateTime: new Date().toISOString().slice(0, 19).replace("T", " ")
  };

  // Guardar en localStorage
  const guardados = JSON.parse(localStorage.getItem("comentarios_" + productID)) || [];
  guardados.push(nuevoComentario);
  localStorage.setItem("comentarios_" + productID, JSON.stringify(guardados));

  // Recargar comentarios desde API + localStorage
  obtenerComentarios();

  // Limpiar formulario
  e.target.reset();
}

// ===============================
// 5) Inicializar
// ===============================
obtenerComentarios();

// Vincular cambio del select de orden
if (selectOrden) {
  selectOrden.addEventListener("change", (e) => {
    ordenarComentarios(e.target.value);
  });
}

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
