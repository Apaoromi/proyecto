document.addEventListener("DOMContentLoaded", function() {
  const categoryID = localStorage.getItem("catID");
  const apiURL = `https://japceibal.github.io/emercado-api/cats_products/${categoryID}.json`;

  let productos = [];

  const imgContainerTitle = document.querySelector(".img-titulo");
  const imgContainerDiv = document.querySelector(".imagen-ruta");
  const titulo = document.getElementById("titulo");
  const btnfiltrar = document.getElementById("filtrar");
  const btnlimpiar = document.getElementById("limpiar-filtro");
  const precioMin = document.getElementById("precio-min");
  const precioMax = document.getElementById("precio-max");
  const buscador = document.getElementById('buscador');
  const btnBuscar = document.getElementById('btn-Buscar');
  const btnOrdenarMenor = document.getElementById("btn-ordenMen");
  const btnOrdenarMayor = document.getElementById("btn-ordenMay");

  // Actualizar banner
  if (categoryID == 101) {
    imgContainerTitle.textContent = "A un solo click del auto de tus sueños ...";
    imgContainerDiv.style.backgroundImage = "url('img/cars_index.jpg')";
    titulo.textContent = "Vehículos disponibles";
  } else if (categoryID == 102) {
    imgContainerTitle.textContent = "Encuentra los juguetes más divertidos para todas las edades ...";
    imgContainerDiv.style.backgroundImage = "url('img/toys_index.jpg')";
    titulo.textContent = "Juguetes disponibles";
  } else if (categoryID == 103) {
    imgContainerTitle.textContent = "Descubrí muebles para tu hogar a un click ...";
    imgContainerDiv.style.backgroundImage = "url('img/furniture_index.jpg')";
    titulo.textContent = "Muebles disponibles";
  }

  imgContainerDiv.style.backgroundSize = "cover";
  imgContainerDiv.style.backgroundPosition = "center";

  // Función para mostrar productos
  function mostrarProductos(lista) {
    const html = lista.map(product => {
      const descriptionHTML = product.description 
        ? `<p class="mb-1">${product.description}</p>` 
        : '';

      return `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="product-info">
            <div>
              <div class="product-title">
                <a href="product-info.html" onclick="setProdID(${product.id})" style="text-decoration:none; color:inherit;">
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
  }

  // Cargar productos
  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      productos = data.products;
      mostrarProductos(productos);
    })
    .catch(error => {
      console.error("Error cargando productos:", error);
      document.getElementById("product-list").innerHTML = "<p>No se pudieron cargar los productos.</p>";
    });

  // Filtrar por precio
  btnfiltrar.addEventListener("click", function() {
    const min = parseInt(precioMin.value) || 0;
    const max = parseInt(precioMax.value) || Infinity;

    if (min > max) {
      alert("El precio mínimo no puede ser mayor al precio máximo");
      return;
    }

    const filtrados = productos.filter(product => 
      product.cost >= min && product.cost <= max
    );

    mostrarProductos(filtrados);
  });

  

  // Limpiar filtro
  btnlimpiar.addEventListener("click", function() {
    precioMin.value = "";
    precioMax.value = "";
    mostrarProductos(productos);
  });

  btnOrdenarMenor.addEventListener("click", function() {
    const ordenadosMenor = productos.sort((a , b) => a.cost - b.cost);
    mostrarProductos(ordenadosMenor);
  });

  btnOrdenarMayor.addEventListener("click", function() {
    const ordenadosMayor = productos.sort((a , b) => b.cost - a.cost);
    mostrarProductos(ordenadosMayor);
  });

  btnBuscar.addEventListener("click", function() {
  const palabra = buscador.value.toLowerCase().trim();

  const resultado = productos.filter(product => 
    product.name.toLowerCase().includes(palabra)
  );

  mostrarProductos(resultado);
});



});


// Guardar ID de producto
function setProdID(id) {
  localStorage.setItem("prodID", id);
  window.location = "product-info.html";
}
