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
      <div class="product-card">
        <h2>${product.name}</h2>
        <img src="${product.images[0]}" alt="${product.name}" class="product-image">
        
        <div class="product-details">
          <p><strong>Descripción:</strong> ${product.description}</p>
          <p><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
          <p><strong>Vendidos:</strong> ${product.soldCount}</p>
          <p><strong>Categoría:</strong> ${product.category}</p>
        </div>
      </div>
    `;

    container.innerHTML = html;
  })
  .catch(error => {
    console.error("Error cargando el producto:", error);
    container.innerHTML = "<p>No se pudo cargar la información del producto.</p>";
  });
