const express = require("express");
const cors = require("cors"); // Importar CORS
require("dotenv").config(); // Cargar las variables de entorno
const db = require("./src/config/dbConfig"); // Importar configuración de la base de datos
// Importar el módulo body-parser
const bodyParser = require('body-parser');

const app = express();
const areaRoutes = require("./src/routes/areaRoutes");
const incidenciaRoutes = require("./src/routes/incidenciaRoutes");
const authRoutes = require("./src/routes/authRoutes");

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Habilitar CORS
app.use(cors());
app.use(bodyParser.json()); // Soporte para JSON en las solicitudes

// Rutas
app.use("/api/areas", areaRoutes);
app.use("/api/incidencias", incidenciaRoutes);
app.use("/api/auth", authRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("¡API de DB Incidencias corriendo!");
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
