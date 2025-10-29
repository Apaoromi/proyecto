
const btnCarrito = document.querySelector("#btnCarrito");
const listaCarrito = document.querySelector("#lista-carrito");
const totalDiv = document.querySelector(".total p");

function appendAlert(msg, tipo) {
  alert(msg);
}

// Función para actualizar carrito y total
async function actualizarLista() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  listaCarrito.innerHTML = "";
  let total = 0;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<li>*Carrito vacío*</li>";
  } else {
    for (const productID of carrito) {
      try {
        const response = await fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`);
        const producto = await response.json();

        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.marginBottom = "8px";

        // Contenido del producto: nombre y precio
        const span = document.createElement("span");
        span.textContent = `${producto.name} - $${producto.cost}`;

        // Botón eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.style.marginLeft = "10px";
        btnEliminar.addEventListener("click", () => {
          carrito = carrito.filter(id => id !== productID);
          localStorage.setItem("carrito", JSON.stringify(carrito));
          appendAlert("Producto eliminado del carrito", "info");
          actualizarLista();
        });

        li.appendChild(span);
        li.appendChild(btnEliminar);
        listaCarrito.appendChild(li);

        total += producto.cost;
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    }
  }

  totalDiv.textContent = `Total Estimado: $${total.toFixed(2)}`;
}

// Cargar lista al iniciar
actualizarLista();

btnCarrito.addEventListener("click", async () => {
  const productID = localStorage.getItem("prodID");
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (!carrito.includes(productID)) {
    carrito.push(productID);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    appendAlert("✅ Producto agregado correctamente al carrito", "success");
  } else {
    appendAlert("⚠️ El producto ya está en el carrito", "warning");
  }

  actualizarLista();
});
