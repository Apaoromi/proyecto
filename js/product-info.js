// Obtener el ID del producto desde localStorage
const productID = localStorage.getItem("prodID");
console.log("ProdID:", productID); // debug

// Construir la URL de la API
const apiURL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
console.log("API URL:", apiURL); // debug

// Contenedor donde se va a mostrar la info
const container = document.getElementById("container-info");

// Fetch a la API
fetch(apiURL)
  .then(response => response.json())
  .then(product => {
    // Generar el HTML del producto
    const html = `
      <div class="product-page">
        <!-- Bloque de la izquierda -->
        <div class="product-detail">
          <h2 class="detail-title">${product.name}</h2>
          <div class="detail-image-container">
            <img src="${product.images[0]}" alt="${product.name}" class="detail-image">
          </div>
          <div class="detail-info">
            <p class="detail-description"><strong>Descripción:</strong> ${product.description}</p>
            <p class="detail-price"><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
            <p class="detail-sold"><strong>Vendidos:</strong> ${product.soldCount}</p>
            <p class="detail-category"><strong>Categoría:</strong> ${product.category}</p>
          </div>
        </div>

        <!-- Bloque de la derecha -->
        <div class="product-rating">
          <h3 class="rating-title">Califica este producto</h3>
          <form id="ratingForm" class="rating-form">
            <div class="rating-stars">
              <input type="radio" name="stars" id="star5" value="5"><label for="star5">★</label>
              <input type="radio" name="stars" id="star4" value="4"><label for="star4">★</label>
              <input type="radio" name="stars" id="star3" value="3"><label for="star3">★</label>
              <input type="radio" name="stars" id="star2" value="2"><label for="star2">★</label>
              <input type="radio" name="stars" id="star1" value="1"><label for="star1">★</label>
            </div>
            <textarea name="comentario" class="rating-comment" placeholder="Escribe tu comentario..."></textarea>
            <button type="submit" class="rating-btn">Enviar</button>
          </form>
          <div id="ratingResult" class="rating-result"></div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Script para manejar la calificación
    document.getElementById("ratingForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const stars = document.querySelector('input[name="stars"]:checked');
      const comment = this.comentario.value;

      if (!stars) {
        alert("Por favor selecciona una cantidad de estrellas.");
        return;
      }

      document.getElementById("ratingResult").innerHTML = `
        <p><strong>Tu calificación:</strong> ${stars.value} ★</p>
        <p><strong>Comentario:</strong> ${comment}</p>
      `;

      this.reset();
    });
  })
  .catch(error => {
    console.error("Error cargando el producto:", error);
    container.innerHTML = "<p>No se pudo cargar la información del producto.</p>";
  });
