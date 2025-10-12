  document.addEventListener("DOMContentLoaded", function() {
  
  const linkUsuario = document.getElementById("link-usuario");
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

  if (usuarioGuardado && linkUsuario) {
    // Cambiar texto y comportamiento
    linkUsuario.textContent = usuarioGuardado.usuario + " (Salir)";
    linkUsuario.href = "#";
    linkUsuario.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("usuario");
      window.location.href = "login.html";
    });
  }

    // Mostrar datos del usuario en el perfil
    const nombreUsuario = document.getElementById("nombre-usuario");
    const apellidoUsuario = document.getElementById("apellido");
    const emailUsuario = document.getElementById("email-usuario");
    const numeroContacto = document.getElementById("numero-contacto");
    const botonEditar = document.getElementById("editar-perfil");


    if (usuarioGuardado) {
        nombreUsuario.textContent =   usuarioGuardado.nombre;
        apellidoUsuario.textContent =  usuarioGuardado.apellido;
        emailUsuario.textContent =  usuarioGuardado.email;
        numeroContacto.textContent =  usuarioGuardado.telefono;
    }

    // Manejar el botón de editar perfil
    //<button id="editar-perfil" type="button">Editar perfil</button>

   botonEditar.addEventListener("click", function editarPerfil() {
  // Cambiar a inputs
  nombreUsuario.innerHTML = `<input type="text" id="input-nombre" value="${usuarioGuardado.nombre}" class="form-control">`;
  apellidoUsuario.innerHTML = `<input type="text" id="input-apellido" value="${usuarioGuardado.apellido}" class="form-control">`;
  emailUsuario.innerHTML = `<input type="email" id="input-email" value="${usuarioGuardado.email}" class="form-control">`;
  numeroContacto.innerHTML = `<input type="text" id="input-telefono" value="${usuarioGuardado.telefono}" class="form-control">`;

  // Cambiar texto del botón
  botonEditar.textContent = "Guardar cambios";

  // Remover el listener actual
  botonEditar.removeEventListener("click", editarPerfil);

  // Agregar nuevo evento para guardar
  botonEditar.addEventListener("click", function guardarCambios() {
    // Guardar cambios del usuario
    usuarioGuardado.nombre = document.getElementById("input-nombre").value;
    usuarioGuardado.apellido = document.getElementById("input-apellido").value;
    usuarioGuardado.email = document.getElementById("input-email").value;
    usuarioGuardado.telefono = document.getElementById("input-telefono").value;

    // Guardar en localStorage
    localStorage.setItem("usuario", JSON.stringify(usuarioGuardado));

    // Mostrar como texto normal otra vez
    nombreUsuario.textContent = usuarioGuardado.nombre;
    apellidoUsuario.textContent = usuarioGuardado.apellido;
    emailUsuario.textContent = usuarioGuardado.email;
    numeroContacto.textContent = usuarioGuardado.telefono;

    // Restaurar botón
    botonEditar.textContent = "Editar perfil";

    // Quitar guardar y volver a habilitar editar
    botonEditar.removeEventListener("click", guardarCambios);
    botonEditar.addEventListener("click", editarPerfil);
  });
});



  });