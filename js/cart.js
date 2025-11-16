// js/cart.js - versión modificada SOLO para:
// ✔ Mostrar productos + cantidad (+/-) EN LA IZQUIERDA
// ✔ Calcular totales como antes
// ✔ Mantener panel derecho SOLO para envío/pago
// ✔ Mantener tu código original sin romper nada

const DOLAR = 40;

// ELEMENTOS DOM
const productListPanel = document.getElementById("product-list"); 
const listaCarrito = document.getElementById("lista-carrito");    
const envioValorSpan = document.getElementById("envio-valor");    
const totalValorSpan = document.getElementById("total-valor");    
const selectTipoEnvio = document.getElementById("tipo-envio");
const btnFinalizar = document.getElementById("btn-finalizar");

// modal
const modal = document.getElementById('modal-finalizar');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalClose = document.getElementById('modal-close');
const modalConfirm = document.getElementById('modal-confirm');

function appendAlert(msg) {
  alert(msg);
}

function porcentajeEnvioSeleccionado() {
  const envio = selectTipoEnvio ? selectTipoEnvio.value : "standard";
  if (envio === "premium") return 0.15;
  if (envio === "express") return 0.07;
  return 0.05;
}

async function actualizarLista() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // LIMPIAR AMBOS PANEL
  listaCarrito.innerHTML = "";
  productListPanel.innerHTML = "";

  // SI ESTÁ VACÍO
  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<li class='al-centro'>*Carrito vacío*</li>";
    productListPanel.innerHTML = `<p class="alerta-vacio">Panel de productos (vacío)</p>`;
    actualizarTotalesVisuales(0, 0);
    return;
  }

  let listaInterna = []; // guardar referencia a items para calcular totales

  for (const productID of carrito) {
    try {
      const res = await fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const producto = await res.json();

      const precioUSD = producto.currency === "UYU" ? producto.cost / DOLAR : producto.cost;
      const precioTexto = producto.currency === "UYU" ? `$ ${producto.cost}` : `U$S ${producto.cost}`;

      const imgSrc = (producto.images && producto.images.length && producto.images[0])
                      || producto.image
                      || producto.img
                      || "https://via.placeholder.com/180x140?text=Sin+imagen";

      // =============================
      // IZQUIERDA (producto + cantidad + botones)
      // =============================
      const card = document.createElement("article");
      card.className = "producto-item-card";

      card.innerHTML = `
        <div class="prod-card-inner" style="
          display:flex;gap:12px;align-items:center;
          padding:10px;border-radius:8px;margin-bottom:12px;
          background:rgba(255,255,255,0.03)
        ">
          <img src="${imgSrc}" alt="${escapeHtml(producto.name)}" 
               style="width:90px;height:70px;object-fit:cover;border-radius:6px;border:1px solid rgba(0,0,0,0.06)">
          
          <div style="flex:1">
            <div style="font-weight:700">${escapeHtml(producto.name)}</div>
            <div style="font-size:0.95rem;color:#666;margin-top:6px">${precioTexto}</div>
          </div>

          <div class="qty-controls" data-id="${productID}" style="
            display:flex;align-items:center;gap:6px;
          ">
            <button class="qty-btn minus" data-id="${productID}" style="padding:3px 7px;">−</button>
            <span class="qty-number" id="qty-${productID}" 
                  style="min-width:18px;text-align:center;">1</span>
            <button class="qty-btn plus" data-id="${productID}" style="padding:3px 7px;">+</button>
          </div>

          <button class="btn-eliminar" data-id="${productID}" 
                  style="margin-left:10px;padding:4px 7px;">✕</button>
        </div>
      `;

      productListPanel.appendChild(card);

      // guardar datos para cálculos
      listaInterna.push({
        id: productID,
        price: precioUSD,
        qtyElement: card.querySelector(`#qty-${productID}`)
      });

    } catch (err) {
      console.error("Error al cargar producto", productID, err);
    }
  }

  // ============================
  // EVENTOS: +, -, eliminar
  // ============================

  // Botón +
  document.querySelectorAll(".qty-btn.plus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = listaInterna.find(x => x.id == id);
      item.qtyElement.textContent = Number(item.qtyElement.textContent) + 1;
      calcularTotales(listaInterna);
    });
  });

  // Botón –
  document.querySelectorAll(".qty-btn.minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const item = listaInterna.find(x => x.id == id);
      let actual = Number(item.qtyElement.textContent);
      if (actual > 1) {
        item.qtyElement.textContent = actual - 1;
        calcularTotales(listaInterna);
      }
    });
  });

  // Eliminar
  document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      let arr = JSON.parse(localStorage.getItem("carrito")) || [];
      const idx = arr.indexOf(id);
      if (idx > -1) {
        arr.splice(idx, 1);
        localStorage.setItem("carrito", JSON.stringify(arr));
      }
      appendAlert("Producto eliminado del carrito");
      actualizarLista();
    });
  });

  calcularTotales(listaInterna);
}

// CÁLCULO
function calcularTotales(lista) {
  let subtotal = 0;

  lista.forEach(item => {
    let qty = Number(item.qtyElement.textContent);
    subtotal += item.price * qty;
  });

  const envio = subtotal * porcentajeEnvioSeleccionado();
  const total = subtotal + envio;

  actualizarTotalesVisuales(envio, total, subtotal);
}

function actualizarTotalesVisuales(envio = 0, total = 0, subtotal = null) {
  if (envioValorSpan) envioValorSpan.textContent = envio.toFixed(2);
  if (totalValorSpan) totalValorSpan.textContent = total.toFixed(2);

  const subtotalSpan = document.getElementById("subtotal-valor");
  if (subtotalSpan && subtotal !== null) subtotalSpan.textContent = subtotal.toFixed(2);

  const totalP = document.querySelector(".total p");
  if (totalP) totalP.textContent = `Total Estimado: U$S ${total.toFixed(2)}`;
}

// modal
if (selectTipoEnvio) selectTipoEnvio.addEventListener("change", () => actualizarLista());
if (btnFinalizar) btnFinalizar.addEventListener("click", () => openModal());

function openModal() {
  modal.style.display = "block";
  modal.classList.remove("modal-hidden");
}

function closeModal() {
  modal.style.display = "none";
  modal.classList.add("modal-hidden");
}

if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
if (modalConfirm) modalConfirm.addEventListener("click", () => {
  appendAlert("Compra finalizada");
  closeModal();
});

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", actualizarLista);


// ================================
// FINALIZAR COMPRA CON VALIDACIONES
// ================================

// Tomamos referencias a los inputs de dirección y forma de pago
const camposDireccion = ["departamento", "localidad", "calle", "numero", "esquina"];
const btnFinalizarCompra = document.getElementById("btn-finalizar");

btnFinalizarCompra.addEventListener("click", () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    appendAlert("El carrito está vacío.");
    return;
  }

  // Validar dirección
  for (const id of camposDireccion) {
    const input = document.getElementById(id);
    if (!input || input.value.trim() === "") {
      appendAlert(`Por favor completa el campo "${id}".`);
      return;
    }
  }

  // Validar tipo de envío
  const tipoEnvio = document.getElementById("tipo-envio").value;
  if (!tipoEnvio) {
    appendAlert("Selecciona un tipo de envío.");
    return;
  }

  // Validar cantidades de productos
  const items = document.querySelectorAll("#product-list .qty-number");
  for (const item of items) {
    const cantidad = Number(item.textContent);
    if (isNaN(cantidad) || cantidad <= 0) {
      appendAlert("Cada producto debe tener una cantidad mayor a 0.");
      return;
    }
  }

  // Validar forma de pago
  const formaPago = document.querySelector('input[name="pago"]:checked');
  if (!formaPago) {
    appendAlert("Selecciona una forma de pago.");
    return;
  }

  // Si todo está correcto, mostramos modal o alert de éxito
  appendAlert("✅ Compra finalizada con éxito. Gracias por tu compra.");

  // Limpiar carrito
  localStorage.removeItem("carrito");
  actualizarLista();
});
