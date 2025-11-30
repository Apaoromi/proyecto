const express = require("express");
const cors = require("cors");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// Cargar usuarios del archivo usuarios.json
function cargarUsuarios() {
  const data = fs.readFileSync("usuarios.json", "utf8");
  return JSON.parse(data);
}

// POST /login
app.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  const usuarios = cargarUsuarios();

  const encontrado = usuarios.find(u => u.usuario === usuario && u.password === password);

  if (!encontrado) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }

  // Crear el token
  const token = jwt.sign(
    { usuario: encontrado.usuario, nombre: encontrado.nombre },
    "CLAVE_SECRETA_SUPER_SEGURA",
    { expiresIn: "2h" }
  );

  res.json({
    mensaje: "Login exitoso",
    token,
    usuario: {
      nombre: encontrado.nombre,
      apellido: encontrado.apellido,
      email: encontrado.email
    }
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});


const express = require("express");
const fs = require("fs");
const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

const SECRET_KEY = "clave_super_secreta";

// Leer usuarios desde JSON
function leerUsuarios() {
  const data = fs.readFileSync("usuarios.json", "utf8");
  return JSON.parse(data);
}

// Guardar usuarios en JSON
function guardarUsuarios(usuarios) {
  fs.writeFileSync("usuarios.json", JSON.stringify(usuarios, null, 2));
}

// 👉 REGISTRO
app.post("/register", (req, res) => {
  const nuevoUsuario = req.body;
  const usuarios = leerUsuarios();

  const existe = usuarios.find(u => u.usuario === nuevoUsuario.usuario);
  if (existe) {
    return res.status(400).json({ error: "El usuario ya existe" });
  }

  usuarios.push(nuevoUsuario);
  guardarUsuarios(usuarios);

  res.json({ mensaje: "Usuario registrado con éxito" });
});

// 👉 LOGIN
app.post("/login", (req, res) => {
  const { usuario, password } = req.body;
  const usuarios = leerUsuarios();

  const user = usuarios.find(u => u.usuario === usuario && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }

  const token = jwt.sign(
    { usuario: user.usuario }, 
    SECRET_KEY,
    { expiresIn: "2h" }
  );

  res.json({
    mensaje: "Login exitoso",
    token,
    usuario: {
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email
    }
  });
});

// Servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
