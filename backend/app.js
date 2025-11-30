import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Necesario para poder usar __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(__dirname));


// ----------------------------------------------------
//  Usuario simulado (contraseña: "1234")
// ----------------------------------------------------
const fakePasswordHash = await bcrypt.hash("1234", 10);

const fakeUser = {
  id: 1,
  usuario: "admin",
  password: fakePasswordHash
};


// ----------------------------------------------------
//  POST /login → genera el token (expira en 30 min)
// ----------------------------------------------------
app.post("/login", async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: "usuario y password requeridos" });
    }

    if (usuario !== fakeUser.usuario) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const ok = await bcrypt.compare(password, fakeUser.password);
    if (!ok) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const payload = { id: fakeUser.id, usuario: fakeUser.usuario };

    //  Token expira en 30 min
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    return res.json({ mensaje: "Login exitoso", token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error interno" });
  }
});


// ----------------------------------------------------
//  Middleware para validar token
// ----------------------------------------------------
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token no enviado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_de_prueba");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}


// ----------------------------------------------------
//  Ruta protegida (solo con token válido)
// ----------------------------------------------------
app.get("/perfil", verificarToken, (req, res) => {
  res.json({
    mensaje: "Accediste al perfil correctamente",
    usuario: req.user.usuario,
    id: req.user.id
  });
});


// ----------------------------------------------------
//  Ruta principal
// ----------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// ----------------------------------------------------
//  Servidor
// ----------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor funcionando en http://localhost:${PORT}`)
);