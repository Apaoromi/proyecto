const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// CATEGORÍAS (cats_products)
// ===============================
app.get('/cats_products/:catID', (req, res) => {
  const catID = req.params.catID;

  const filePath = path.join(__dirname, 'data', 'cats_products', `${catID}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }

  const data = fs.readFileSync(filePath, 'utf8');
  res.json(JSON.parse(data));
});

// ===============================
// PRODUCTOS INDIVIDUALES (products)
// ===============================
app.get('/products/:id', (req, res) => {
  const id = req.params.id;

  const filePath = path.join(__dirname, 'data', 'products', `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const data = fs.readFileSync(filePath, 'utf8');
  res.json(JSON.parse(data));
});

// ===============================
// SERVIDOR
// ===============================
app.listen(3000, () => {
  console.log('Servidor levantado en http://localhost:3000');
});
