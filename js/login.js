function showAlertSuccess() {
  document.getElementById("alert-success").classList.add("show");
}

function showAlertError() {
  document.getElementById("alert-danger").classList.add("show");
}

document.addEventListener("DOMContentLoaded", function () {
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

  if (window.location.pathname.includes("index.html") && !usuarioGuardado) {
    window.location.href = "login.html";
  }

  if (window.location.pathname.includes("login.html") && usuarioGuardado) {
    Swal.fire({
      title: '¡Bienvenido nuevamente!',
      text: 'Hola, ' + usuarioGuardado.nombre,
      icon: 'success',
      confirmButtonText: 'Ir al inicio',
      customClass: {
        confirmButton: 'btn-inicio'
      },
      allowOutsideClick: false,
      timer: 10000,
      timerProgressBar: true,
      willClose: () => {
        window.location.href = 'index.html';
      }
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = 'index.html';
      }
    });
  }
});

document.getElementById("formRegistro")?.addEventListener("submit", function (event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();
  const password2 = document.getElementById("password2").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();

  if (nombre === "" || usuario === "" || password === "" || password2 === ""
    || apellido === "" || email === "" || telefono === "") {
    showAlertError();
    return;
  }

  if (password.length < 6) {
    showAlertError();
    return;
  }

  if (password !== password2) {
    showAlertError();
    return;
  }

  
  const datosUsuario = {
    usuario,
    nombre,
    apellido,
    email,
    telefono,
    imagen: imagen || 'img/img_perfil.png'
  };

  localStorage.setItem("usuario", JSON.stringify(datosUsuario));

  showAlertSuccess();

  setTimeout(function () {
    window.location.href = "index.html";
  }, 1500);
});
