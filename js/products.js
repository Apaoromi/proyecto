const categoryID = localStorage.getItem("catID");
const apiURL = `https://japceibal.github.io/emercado-api/cats_products/${categoryID}.json`;

fetch(apiURL)
  .then(response => response.json())
  .then(data => {
    let html = "";
    data.products.forEach(product => {
      html += `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <a id="nomm" href="product-info.html?id=${product.id}">${product.name}</a>
          <p>${product.description}</p>
          <div class="price">${product.currency} ${product.cost}</div>
          <div class="sold">Vendidos: ${product.soldCount}</div>
        </div>
      `;
    });
    document.getElementById("product-list").innerHTML = html;
  })