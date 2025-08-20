const categoryID = localStorage.getItem("catID");
const apiURL = `https://japceibal.github.io/emercado-api/cats_products/${categoryID}.json`;

fetch(apiURL)
  .then(response => response.json())
  .then(data => {
    let html = "";
    data.products.forEach(product => {
      // Crear el HTML para la descripción (que contiene el año)
      const descriptionHTML = product.description ? `<span>${product.description}</span>` : '';
      
      html += `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="product-info">
            <div class="product-title">
              <a href="product-info.html?id=${product.id}" style="text-decoration:none; color:inherit;">
                ${product.name}
              </a>
            </div>
            <div class="product-details">
              ${descriptionHTML}
              <span>${product.fuel || "Nafta"}</span>
              <span>Vendidos: ${product.soldCount}</span>
            </div>
            <div class="product-price">${product.currency} ${product.cost}</div>
          </div>
        </div>
      `;
    });
    document.getElementById("product-list").innerHTML = html;
  });