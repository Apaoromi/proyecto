// Obtener el ID del producto desde localStorage
const productID = localStorage.getItem("prodID");
console.log("ProdID:", productID);

// Obtener el usuario guardado en localStorage
const usuarioGuardado = localStorage.getItem("usuario");

// Construir la URL de la API para la info del producto
const apiURL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;

// Contenedores de info
const container = document.getElementById("container-info");
const relatedProductsContainer = document.getElementById("productos-relacionados-container"); // ID actualizado

// Contenedor de comentarios
const comentariosContainer = document.getElementById("lista-comentarios");

const btnEnviar = document.getElementById("btn-comentario");

// Select de ordenar
const selectOrden = document.getElementById("orden");

let comentarios = [];

// ====================================================================
// FUNCIONES DE PRODUCTOS RELACIONADOS
// ====================================================================

/**
 * Función para guardar el ID de un producto en localStorage y recargar la página.
 * Esto simula la navegación a la página de otro producto.
 * @param {string} id - El ID del producto relacionado seleccionado.
 */
function setProductIDAndReload(id) {
    localStorage.setItem("prodID", id);
    window.location.reload(); // Recarga la página para mostrar el nuevo producto
}

/**
 * Función para generar y mostrar la sección de productos relacionados.
 * @param {Array<Object>} relatedProducts - Array de productos relacionados (con id, name, y image).
 */
function showRelatedProducts(relatedProducts) {
    if (!relatedProductsContainer) {
        console.error("Contenedor de productos relacionados no encontrado.");
        return;
    }

    let htmlContent = '';

    if (relatedProducts && relatedProducts.length > 0) {
        // Envolvemos los relacionados en una fila (row) para usar las columnas de Bootstrap
        htmlContent += '<div class="row">';
        relatedProducts.forEach(relatedProduct => {
            // Utilizamos clases de Bootstrap para una mejor presentación
            htmlContent += `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card cursor-active h-100" onclick="setProductIDAndReload('${relatedProduct.id}')">
                        <img src="${relatedProduct.image}" class="card-img-top" alt="${relatedProduct.name}">
                        <div class="card-body">
                            <h5 class="card-title">${relatedProduct.name}</h5>
                            <p class="card-text text-muted">Ver producto</p>
                        </div>
                    </div>
                </div>
            `;
        });
        htmlContent += '</div>';
    } else {
        htmlContent = '<p class="text-muted">No hay productos relacionados para mostrar.</p>';
    }

    relatedProductsContainer.innerHTML = htmlContent;

    // Hacemos la función globalmente accesible para el onclick en el HTML generado
    window.setProductIDAndReload = setProductIDAndReload;
}

// ====================================================================
// 1) Cargar la info del producto Y RELACIONADOS
// ====================================================================
fetch(apiURL)
    .then(response => response.json())
    .then(product => {
        // A. Mostrar la información del producto principal
        const html = `
            <div class="product-page">
                <div class="product-detail">
                    <h2 class="detail-title">${product.name}</h2>
                    <div class="detail-image-container">
                        <img src="${product.images[0]}" alt="${product.name}" class="detail-image">
                    </div>
                    <div class="detail-info">
                        <p><strong>Descripción:</strong> ${product.description}</p>
                        <p><strong>Precio:</strong> ${product.currency} ${product.cost}</p>
                        <p><strong>Vendidos:</strong> ${product.soldCount}</p>
                        <p><strong>Categoría:</strong> ${product.category}</p>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = html;

        // B. Mostrar los productos relacionados usando la nueva función
        if (product.relatedProducts) {
            showRelatedProducts(product.relatedProducts);
        }
    })
    .catch(error => {
        console.error("Error cargando el producto:", error);
        container.innerHTML = "<p>No se pudo cargar la información del producto.</p>";
    });

// ====================================================================
// 2) Cargar comentarios
// ====================================================================
function obtenerComentarios() {
    fetch(`https://japceibal.github.io/emercado-api/products_comments/${productID}.json`)
        .then(res => res.json())
        .then(data => {
            comentarios = data;

            // Traer los guardados en localStorage
            const guardados = JSON.parse(localStorage.getItem("comentarios_" + productID)) || [];
            comentarios = comentarios.concat(guardados);

            // Orden inicial: más recientes
            ordenarComentarios("fecha_desc");
        });
}

// ====================================================================
// 3) Mostrar comentarios
// ====================================================================
function mostrarComentarios(lista) {
    comentariosContainer.innerHTML = lista.map(c => `
        <div class="comentario" data-puntuacion="${c.score}" data-fecha="${c.dateTime}">
            <strong>${c.user}</strong> - ${c.dateTime}<br>
            ${"★".repeat(c.score)}${"☆".repeat(5 - c.score)}<br>
            ${c.description}
            <hr>
        </div>
    `).join("");
}

// ====================================================================
// 3.1) Ordenar comentarios
// ====================================================================
function ordenarComentarios(criterio) {
    let ordenados = [...comentarios];

    switch (criterio) {
        case "fecha_desc":
            ordenados.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
            break;
        case "fecha_asc":
            ordenados.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
            break;
        case "puntuacion_desc":
            ordenados.sort((a, b) => b.score - a.score);
            break;
        case "puntuacion_asc":
            ordenados.sort((a, b) => a.score - b.score);
            break;
    }

    mostrarComentarios(ordenados);
}

// ====================================================================
// 4) Guardar nuevo comentario
// ====================================================================
document.addEventListener("submit", function(e) {
    if (e.target.id === "ratingForm") { // Aseguramos que solo se ejecute para el formulario de rating
        guardarComentario(e);
    }
});

function guardarComentario(e) {
    e.preventDefault();

    const stars = document.querySelector('input[name="stars"]:checked');
    const comment = document.getElementById("comentario-text").value; // Obtener el valor de la textarea

    if (!stars || comment.trim() === "") {
        alert("Por favor selecciona una cantidad de estrellas y escribe un comentario.");
        return;
    }

    const nuevoComentario = {
        product: productID,
        score: parseInt(stars.value),
        description: comment,
        user: usuarioGuardado || "Usuario Anónimo", // Usar un valor por defecto si no está logueado
        dateTime: new Date().toISOString().slice(0, 19).replace("T", " ")
    };

    // Guardar en localStorage
    const guardados = JSON.parse(localStorage.getItem("comentarios_" + productID)) || [];
    guardados.push(nuevoComentario);
    localStorage.setItem("comentarios_" + productID, JSON.stringify(guardados));

    // Recargar comentarios
    obtenerComentarios();

    // Limpiar formulario
    e.target.reset();
}

// ====================================================================
// 5) Inicializar
// ====================================================================
document.addEventListener("DOMContentLoaded", () => {
    obtenerComentarios();

    // Vincular cambio del select de orden
    if (selectOrden) {
        selectOrden.addEventListener("change", (e) => {
            ordenarComentarios(e.target.value);
        });
    }

    // Lógica para el link de usuario/login/logout (manteniendo tu código)
    const linkUsuario = document.getElementById("link-usuario");
    if (usuarioGuardado && linkUsuario) {
        linkUsuario.textContent = usuarioGuardado + " (Salir)";
        linkUsuario.href = "#";
        linkUsuario.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("usuario");
            window.location.href = "login.html";
        });
    }
});