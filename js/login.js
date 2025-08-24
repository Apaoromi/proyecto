function showAlertSuccess() {
  document.getElementById("alert-success").classList.add("show");
}

function showAlertError() {
  document.getElementById("alert-danger").classList.add("show");
}

document.addEventListener("DOMContentLoaded", function () {
  const usuarioGuardado = localStorage.getItem("usuario");

  if (window.location.pathname.includes("index.html") && !usuarioGuardado) {
    window.location.href = "login.html";
  }

  if (window.location.pathname.includes("login.html") && usuarioGuardado) {
    Swal.fire({
      title: '¡Bienvenido nuevamente!',
      text: 'Hola, ' + usuarioGuardado,
      icon: 'success',
      confirmButtonText: 'Ir al inicio',
      customClass: {
        confirmButton: 'btn-inicio'
      },
      allowOutsideClick: false,
      timer: 10000,           // Cierra el popup automáticamente después de 15s
      timerProgressBar: true, // Opcional: muestra una barra de progreso del tiempo
      willClose: () => {
        // Cuando el popup se cierre (por timer o por click), redirigimos
        window.location.href = 'index.html';
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario hizo click en el botón
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

  if (nombre === "" || usuario === "" || password === "" || password2 === "") {
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

  localStorage.setItem("usuario", usuario);
  showAlertSuccess();

  setTimeout(function () {
    window.location.href = "index.html";
  }, 1500);
});
