const categoryID = localStorage.getItem("catID");
const apiURL = `https://japceibal.github.io/emercado-api/cats_products/${categoryID}.json`;

// Actualizar el banner según la categoría
document.addEventListener("DOMContentLoaded", function() {
  const imgContainerTitle = document.querySelector(".img-titulo");
  const imgContainerDiv = document.querySelector(".imagen-ruta");

  if (categoryID == 101) {
    imgContainerTitle.textContent = "A un solo click del auto de tus sueños ...";
    imgContainerDiv.style.backgroundImage = "url('img/cars_index.jpg')";
  } else if (categoryID == 102) {
    imgContainerTitle.textContent = "Encuentra los juguetes más divertidos para todas las edades ...";
    imgContainerDiv.style.backgroundImage = "url('img/toys_index.jpg')";
  } else if (categoryID == 103) {
    imgContainerTitle.textContent = "Descubrí muebles para tu hogar a un click ...";
    imgContainerDiv.style.backgroundImage = "url('img/furniture_index.jpg')";
  }

  imgContainerDiv.style.backgroundSize = "cover";
  imgContainerDiv.style.backgroundPosition = "center";
});

fetch(apiURL)
  .then(response => response.json())
  .then(data => {
    const html = data.products.map(product => {
      const descriptionHTML = product.description 
        ? `<p class="mb-1">${product.description}</p>` 
        : '';

      return `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="product-info">
            <div>
              <div class="product-title">
                <a href="product-info.html?id=${product.id}" style="text-decoration:none; color:inherit;">
                  ${product.name}
                </a>
              </div>
              <div class="product-details">
                ${descriptionHTML}
                <p>Vendidos: ${product.soldCount}</p>
              </div>
            </div>
            <div class="product-price">${product.currency} ${product.cost}</div>
          </div>
        </div>
      `;
    }).join('');

    document.getElementById("product-list").innerHTML = html;
  })
  .catch(error => {
    console.error("Error cargando productos:", error);
    document.getElementById("product-list").innerHTML = "<p>No se pudieron cargar los productos.</p>";
  });
