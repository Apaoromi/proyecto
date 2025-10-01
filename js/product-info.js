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

let comentarios = [];

// ===============================
// 1) Cargar la info del producto
// ===============================
fetch(apiURL)
  .then(response => response.json())
  .then(product => {
    const html = `
      <div class="product-page">
        <!-- Bloque de la izquierda -->
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

        <!-- Bloque de la derecha -->
        <div class="product-rating">
          <h3>Califica este producto</h3>
          <form id="ratingForm">
            <div class="rating-stars">
              <input type="radio" name="stars" id="star5" value="5"><label for="star5">★</label>
              <input type="radio" name="stars" id="star4" value="4"><label for="star4">★</label>
              <input type="radio" name="stars" id="star3" value="3"><label for="star3">★</label>
              <input type="radio" name="stars" id="star2" value="2"><label for="star2">★</label>
              <input type="radio" name="stars" id="star1" value="1"><label for="star1">★</label>
            </div>
            <textarea name="comentario" placeholder="Escribe tu comentario..."></textarea>
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    `;
    container.innerHTML = html;

    // Activar manejo del formulario
    document.getElementById("ratingForm").addEventListener("submit", guardarComentario);
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

      mostrarComentarios(comentarios);
    });
}

function mostrarComentarios(lista) {
  comentariosContainer.innerHTML = "";
  for (let c of lista) {
    comentariosContainer.innerHTML += `
      <div class="comentario">
        <strong>${c.user}</strong> - ${c.dateTime}<br>
        ${"★".repeat(c.score)}${"☆".repeat(5 - c.score)}<br>
        ${c.description}
      </div>
    `;
  }
}

// ===============================
// 3) Guardar nuevo comentario
// ===============================
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
    user: usuarioGuardado, // o el usuario logueado
    dateTime: new Date().toISOString().slice(0, 19).replace("T", " ")
  };

  // agregar al array
  comentarios.push(nuevoComentario);

  const guardados = JSON.parse(localStorage.getItem("comentarios_" + productID)) || [];
  guardados.push(nuevoComentario);
  localStorage.setItem("comentarios_" + productID, JSON.stringify(guardados));

  mostrarComentarios(comentarios);

  e.target.reset();
}


obtenerComentarios();
