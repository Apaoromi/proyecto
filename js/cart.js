const btnCarrito = document.querySelector("#btnCarrito");
const listaCarrito = document.querySelector("#lista-carrito");
const totalDiv = document.querySelector(".total p");
const tipoEnvio = document.getElementById("#tipo-envio");

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
        let precioUSD;
        if (producto.currency === "UYU") {
          precioTexto = `$ ${producto.cost}`;
          precioUSD = producto.cost / DOLAR;
        } else {
          precioTexto = `U$S ${producto.cost}`;
          precioUSD = producto.cost;
        }

        // Elementos del producto
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.marginBottom = "8px";

        const infoDiv = document.createElement("div");
        infoDiv.textContent = `${producto.name} - ${precioTexto}`;

        // Input para cantidad
        const aumentarCantidad = document.createElement("input");
        aumentarCantidad.type = "number";
        aumentarCantidad.value = 1;
        aumentarCantidad.min = 1;
        aumentarCantidad.style.width = "50px";
        aumentarCantidad.style.marginLeft = "10px";

        // Actualizar total cuando cambia la cantidad
        aumentarCantidad.addEventListener("input", () => {
          calcularTotal();
        });

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

        // Agregar elementos al li
        li.appendChild(infoDiv);
        li.appendChild(aumentarCantidad);
        li.appendChild(btnEliminar);
        listaCarrito.appendChild(li);

        // Guardar costo del producto en el elemento (para calcular total)
        li.dataset.precio = precioUSD;

      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    }
  }

  function tipoEnvio() {
  const envioSeleccionado = document.getElementById("tipo-envio").value;
  let porcentajeEnvio = 0;

  if (envioSeleccionado === "premium") {
    porcentajeEnvio = 0.15;
  } else if (envioSeleccionado === "express") {
    porcentajeEnvio = 0.07;
  } else if (envioSeleccionado === "standard") {
    porcentajeEnvio = 0.05;
  }

  return porcentajeEnvio;
}




  // Función interna para recalcular el total
  function calcularTotal() {
    let total = 0;
    const items = listaCarrito.querySelectorAll("li");
    items.forEach(item => {
      const input = item.querySelector("input[type='number']");
      const precio = parseFloat(item.dataset.precio);
      const cantidad = input ? parseInt(input.value) : 1;
      total += precio * cantidad * (1 + tipoEnvio());
    });
    totalDiv.textContent = `Total Estimado: U$S ${total.toFixed(2)}`;
  }



  document.getElementById("tipo-envio").addEventListener("change", calcularTotal);
}



actualizarLista();




/*
Agregar sección de "Tipo de envío", donde permita elegir entre las opciones "Premium 2 a 5 días (15%)", "Express 5 a 8 días (7%)" y "Standard 12 a 15 días (5%)".
Agregar sección de "Dirección de envío", donde contenga los campos de texto "Departamento", "Localidad", "Calle", "Número" y "Esquina".
Agregar sección de "Forma de pago", donde permita elegir como mínimo dos opciones de pago diferentes. Las sugeridas son "Tarjeta de crédito" y "Transferencia bancaria".
Agregar sección de "Costos", donde se muestren los valores del "Subtotal" (suma de todos los subtotales de cada producto), el "Costo de envío" (subtotal multiplicado por el porcentaje del envío seleccionado) y el "Total" (costo final de la compra).
Agregar botón "Finalizar compra".
*/


