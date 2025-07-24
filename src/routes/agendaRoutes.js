// const express = require("express");
// const {
//   crearCita,
//   obtenerCitasFirmas,
//   obtenerCitas,
//   actualizarEstadoCita,
//   RecordatorioAtu,
//   RecordatorioExtraProcolar,
//   getReporteAgendaBot,
// } = require("../controllers/agendaController");

// const router = express.Router();

// // Rutas para las citas
// router.post("/", crearCita); // Ruta para crear una cita
// router.post("/testamento", RecordatorioAtu);
// router.post("/legalizacion", RecordatorioExtraProcolar);
// router.get("/", obtenerCitas); // Ruta para obtener todas las citas
// router.get("/firma", obtenerCitasFirmas); // Ruta para obtener todas las citas para firmas
// router.get("/reporteagenda", getReporteAgendaBot);

// // Ruta para actualizar el estado de una cita
// router.put("/:id", actualizarEstadoCita);
// module.exports = router;




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
