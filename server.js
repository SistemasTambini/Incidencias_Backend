const express = require("express");
const mysql = require("mysql");
require("dotenv").config();

const app = express();

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

// Validar conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.message);
  } else {
    console.log("Conexión exitosa a la base de datos.");
  }
});

// Ruta base
app.get("/", (req, res) => {
  res.send("¡API de DB Incidencias corriendo!");
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
