const categoryID = 101;
const apiURL = `https://japceibal.github.io/emercado-api/cats_products/${categoryID}.json`;

fetch(apiURL)
  .then(response => response.json())
  .then(data => {
    let html = "";
    data.products.forEach(product => {
      html += `
        <div class="productos">
          <img src="${product.image}" alt="${product.name} >
          <h3 >${product.name}</h3>
          <p>${product.description}</p>
          <div class="precio">${product.currency} ${product.cost}</div>
          <div class="vendidos">Vendidos: ${product.soldCount}</div>
        </div>
      `;
    });
    document.getElementById("product-list").innerHTML = html;
  });