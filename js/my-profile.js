document.addEventListener("DOMContentLoaded", function () {
  const linkUsuario = document.getElementById("link-usuario");
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

  if (usuarioGuardado && linkUsuario) {
    linkUsuario.textContent = usuarioGuardado.usuario + " (Mi perfil)";
    linkUsuario.href = "#";
    linkUsuario.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "my-profile.html";
    });
  }

  const nombreUsuario = document.getElementById("nombre-usuario");
  const apellidoUsuario = document.getElementById("apellido");
  const emailUsuario = document.getElementById("email-usuario");
  const numeroContacto = document.getElementById("numero-contacto");
  const botonEditar = document.getElementById("editar-perfil");
  const imagenPerfil = document.getElementById("imagen-perfil");
  const botonBorrar = document.getElementById("borrar-perfil");

  botonBorrar.addEventListener("click", function () {
    localStorage.removeItem("usuario");
    window.location.href = "login.html";
  });

  if (usuarioGuardado) {
    nombreUsuario.textContent = usuarioGuardado.nombre;
    apellidoUsuario.textContent = usuarioGuardado.apellido;
    emailUsuario.textContent = usuarioGuardado.email;
    numeroContacto.textContent = usuarioGuardado.telefono;

    imagenPerfil.innerHTML = `
      <img src="${usuarioGuardado.imagen || 'img/img_perfil.png'}" 
           alt="Imagen de perfil" 
           class="img-fluid rounded-circle" 
           style="width: 150px; height: 150px; object-fit: cover;">
    `;
  }

  botonEditar.addEventListener("click", function editarPerfil() {
    nombreUsuario.innerHTML = `<input type="text" id="input-nombre" value="${usuarioGuardado.nombre}" class="form-control">`;
    apellidoUsuario.innerHTML = `<input type="text" id="input-apellido" value="${usuarioGuardado.apellido}" class="form-control">`;
    emailUsuario.innerHTML = `<input type="email" id="input-email" value="${usuarioGuardado.email}" class="form-control">`;
    numeroContacto.innerHTML = `<input type="text" id="input-telefono" value="${usuarioGuardado.telefono}" class="form-control">`;

    imagenPerfil.innerHTML = `
  <label for="input-imagen">Cambiar imagen de perfil</label>
  <input type="file" id="input-imagen" accept="image/*" class="form-control mb-2">
  <div id="imagen-perfil" style="background-image: url('${usuarioGuardado.imagen || 'img/img_perfil.png'}');"></div>
`;

    botonEditar.textContent = "Guardar cambios";
    botonEditar.removeEventListener("click", editarPerfil);

    botonEditar.addEventListener("click", function guardarCambios() {
      usuarioGuardado.nombre = document.getElementById("input-nombre").value;
      usuarioGuardado.apellido = document.getElementById("input-apellido").value;
      usuarioGuardado.email = document.getElementById("input-email").value;
      usuarioGuardado.telefono = document.getElementById("input-telefono").value;

      const imagenInput = document.getElementById("input-imagen");

      if (imagenInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function () {
          usuarioGuardado.imagen = reader.result;
          guardarYActualizar();
        };
        reader.readAsDataURL(imagenInput.files[0]);
      } else {
        guardarYActualizar();
      }

      function guardarYActualizar() {
        localStorage.setItem("usuario", JSON.stringify(usuarioGuardado));

        imagenPerfil.innerHTML = `
          <img src="${usuarioGuardado.imagen}" 
               alt="Imagen de perfil" 
               class="img-fluid rounded-circle" 
               style="width: 150px; height: 150px; object-fit: cover;">
        `;
        nombreUsuario.textContent = usuarioGuardado.nombre;
        apellidoUsuario.textContent = usuarioGuardado.apellido;
        emailUsuario.textContent = usuarioGuardado.email;
        numeroContacto.textContent = usuarioGuardado.telefono;

        botonEditar.textContent = "Editar perfil";
        botonEditar.removeEventListener("click", guardarCambios);
        botonEditar.addEventListener("click", editarPerfil);
      }
    });
  });
});
