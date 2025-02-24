const express = require("express");
const { getAllIncidencias,createIncidencia } = require("../controllers/incidenciaController");


const router = express.Router();

// Ruta protegida: Solo usuarios con "ver_incidencias" pueden acceder
router.get("/", getAllIncidencias);

// Ruta para crear una nueva incidencia
router.post("/", createIncidencia);

module.exports = router;
