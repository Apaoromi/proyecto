document.addEventListener("DOMContentLoaded", function() {

    const idprod = JSON.parse(localStorage.getItem("carrito")) || [];
  const listaCarrito = document.getElementById("lista-carrito");
  const totalElem = document.querySelector(".total p");
  let carrito = [];


    if(idprod.length === 0){
        listaCarrito.innerHTML = "<p>El carrito está vacío.</p>";
        totalElem.textContent = "Total: $0";
        return;
    }

    idprod.forEach(element => {
    fetch(`https://japceibal.github.io/emercado-api/user_cart/${element}.json`)
      .then(response => response.json())
      .then(data => {
        carrito.push(...data.articles);
        mostrarCarrito();
        actualizarTotal();
      })
      .catch(error => console.error("Error al cargar producto:", error));
  });

    function mostrarCarrito() {
    listaCarrito.innerHTML = "";

    carrito.forEach((item, index) => {
      const li = document.createElement("li");
      li.classList.add("carrito-item");
      li.innerHTML = `
        <div class="d-flex align-items-center mb-2 border-bottom pb-2">
          <img src="${item.image}" alt="${item.name}" class="me-3" style="width:70px; height:auto;">
          <div class="flex-grow-1">
            <p class="m-0 fw-bold">${item.name}</p>
            <p class="m-0">${item.currency} ${item.unitCost.toLocaleString()}</p>
            <label class="me-2 mt-1">Cantidad:</label>
            <input type="number" value="${item.count}" min="1" class="cantidad-input" data-index="${index}" style="width:60px;">
          </div>
          <div class="text-end">
            <p class="m-0 fw-bold">Subtotal:</p>
            <p id="subtotal-${index}">${item.currency} ${(item.unitCost * item.count).toLocaleString()}</p>
          </div>
        </div>
      `;
      listaCarrito.appendChild(li);
    });


    };

     document.querySelectorAll(".cantidad-input").forEach(input => {
      input.addEventListener("change", e => {
        const index = e.target.dataset.index;
        carrito[index].count = parseInt(e.target.value);
        mostrarCarrito();
        actualizarTotal();
      });
    });
  
    function actualizarTotal() {
    let subtotal = carrito.reduce((acc, item) => acc + (item.unitCost * item.count), 0);
    let total = subtotal + envio;
    totalElem.textContent = `Total Estimado: $${total.toLocaleString()}`;
  }

});