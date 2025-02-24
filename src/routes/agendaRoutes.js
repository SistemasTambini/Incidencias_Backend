const express = require("express");
const { crearCita, obtenerCitas,actualizarEstadoCita,RecordatorioAtu,RecordatorioExtraProcolar } = require("../controllers/agendaController");

const router = express.Router();

// Rutas para las citas
router.post("/", crearCita); // Ruta para crear una cita
router.post("/Atu", RecordatorioAtu); 
router.post("/Ext", RecordatorioExtraProcolar); 
router.get("/", obtenerCitas); // Ruta para obtener todas las citas

// Ruta para actualizar el estado de una cita
router.put("/:id", actualizarEstadoCita);
module.exports = router;