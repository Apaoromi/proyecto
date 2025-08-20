function showAlertSuccess() {
  document.getElementById("alert-success").classList.add("show");
}

function showAlertError() {
  document.getElementById("alert-danger").classList.add("show");
}

document.addEventListener("DOMContentLoaded", function() {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
        alert("Bienvenido nuevamente, " + usuarioGuardado);
        window.location.href = "index.html";
    }
});


document.getElementById("formRegistro").addEventListener("submit", function(event) {
  event.preventDefault(); 

  const nombre = document.getElementById("nombre").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();
  const password2 = document.getElementById("password2").value.trim();

  if (nombre === "" || usuario === "" || password === "" || password2 === "") {
    showAlertError();
    return;
  }

  if ( password.length < 6) {
    showAlertError();
    return;
  }

  if (password !== password2) {
    showAlertError();
    return;
  }


  localStorage.setItem("usuario", usuario);


  showAlertSuccess();


  setTimeout(function() {
    window.location.href = "index.html";
  }, 1500);
});
