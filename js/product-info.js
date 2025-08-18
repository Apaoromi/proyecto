const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log("ID del producto:", productId);

const apiURL = `https://japceibal.github.io/emercado-api/products/${productId}.json`;

fetch(apiURL)
  .then(response => response.json())
  .then(product => {
    document.getElementById("product-container").innerHTML = `
      <h2>${product.name}</h2>
      <img src="${product.images[0]}" alt="${product.name}">
      <p>${product.description}</p>
      <p><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
      <p><strong>Vendidos:</strong> ${product.soldCount}</p>
    `;
  });
