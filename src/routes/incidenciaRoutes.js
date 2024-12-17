const express = require("express");
const { getAllIncidencias } = require("../controllers/incidenciaController");

const router = express.Router();

// Ruta para obtener todas las incidencias
router.get("/", getAllIncidencias);

module.exports = router;
