
const express = require("express");
const {
  crearCita,
  obtenerCitasFirmas,
  obtenerCitas,
  actualizarEstadoCita,
  RecordatorioAtu,
  RecordatorioExtraProcolar,
  getReporteAgendaBot,
  cargarArchivoMasivo
} = require("../controllers/agendaController");

const upload = require("../middleware/upload");

const router = express.Router();

// Rutas para las citas
router.post("/", crearCita);
router.post("/testamento", RecordatorioAtu);
router.post("/legalizacion", RecordatorioExtraProcolar);
router.get("/", obtenerCitas);
router.get("/firma", obtenerCitasFirmas);
router.get("/reporteagenda", getReporteAgendaBot);

// ✅ Nueva ruta para carga masiva
router.post("/carga-masiva", upload.single("archivo"), cargarArchivoMasivo);

// Ruta para actualizar el estado
router.put("/:id", actualizarEstadoCita);

module.exports = router;
