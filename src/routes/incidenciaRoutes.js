const express = require("express");
const { getAllIncidencias,createIncidencia } = require("../controllers/incidenciaController");

const router = express.Router();

// Ruta para obtener todas las incidencias
router.get("/", getAllIncidencias);

// Ruta para crear una nueva incidencia
router.post("/", createIncidencia);

module.exports = router;
