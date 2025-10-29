const btnCarrito = document.querySelector("#btnCarrito");
const listaCarrito = document.querySelector("#lista-carrito");
const totalDiv = document.querySelector(".total p");

const DOLAR = 40; // 1 USD = 40 UYU

function appendAlert(msg, tipo) {
  alert(msg);
}

async function actualizarLista() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  listaCarrito.innerHTML = "";
  let totalUSD = 0;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<li>*Carrito vacío*</li>";
  } else {
    for (const productID of carrito) {
      try {
        const response = await fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`);
        const producto = await response.json();

        // Mostrar precio con símbolo según moneda
        let precioTexto;
        if (producto.currency === "UYU") {
          precioTexto = `$ ${producto.cost}`;
          totalUSD += producto.cost / DOLAR;
        } else {
          precioTexto = `U$S ${producto.cost}`;
          totalUSD += producto.cost;
        }

        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.marginBottom = "8px";

        const span = document.createElement("span");
        span.textContent = `${producto.name} - ${precioTexto}`;

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

      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    }
  }

  totalDiv.textContent = `Total Estimado: U$S ${totalUSD.toFixed(2)}`;
}

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
