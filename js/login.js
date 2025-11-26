document.getElementById("formLogin")?.addEventListener("submit", async function (event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!usuario || !password) {
    showAlertError();
    return;
  }

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      showAlertSuccess();
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } else {
      showAlertError();
    }
  } catch (err) {
    console.error(err);
    showAlertError();
  }
});
