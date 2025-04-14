const express = require("express");
const { obtenerCalificaciones, crearCalificacion,obtenerUsuariosPorArea,obtenerAreas } = require("../controllers/calificacionController");

const router = express.Router();

// Ruta para obtener todas las calificaciones
router.get("/", obtenerCalificaciones);

// Ruta para crear una nueva calificación
router.post("/", crearCalificacion);

router.get("/areas", obtenerAreas); // Primero rutas específicas
router.get("/:area", obtenerUsuariosPorArea); // Luego rutas dinámicas

module.exports = router;