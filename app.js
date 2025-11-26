import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));



// --- Usuario simulado ---
const fakeUser = {
  id: 1,
  usuario: "admin",
  // contraseña original: "1234"
  password: await bcrypt.hash("1234", 10)
};



// ---------- Endpoint POST /login ----------
app.post("/login", async (req, res) => {
  try {
    const { usuario, password } = req.body;
    if (!usuario || !password) {
      return res.status(400).json({ error: "usuario y password requeridos" });
    }


    if (usuario !== fakeUser.usuario) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // --- comparar password ingresada con hash ---
    const ok = await bcrypt.compare(password, fakeUser.password);
    if (!ok) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }


    const payload = { id: fakeUser.id, usuario: fakeUser.usuario };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "clave_de_prueba", {
      expiresIn: "1h"
    });


    return res.json({ mensaje: "Login exitoso", token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error interno" });
  }
});

// ---- Ruta principal si la tenías ----
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
