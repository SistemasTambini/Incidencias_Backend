const express = require("express");
const router = express.Router();
const {
  crearRegistro,
  obtenerRegistros,
  obtenerPersonalxArea,
  UpdateRegistroLlamadas,
  updateEstadoEnvioWsp,
  cambioEstado,
  // obtenerRegistrosXusuario,
  getReporteLLamadas // ✅ importar el nuevo controller
} = require("../controllers/registroLLamadasController");

// POST: Crear un nuevo registro
router.post("/", crearRegistro);

// GET: Obtener todos los registros
router.get("/", obtenerRegistros);

// GET: Obtener todos los  por usuario
// router.get("/", obtenerRegistrosXusuario);

// GET: Obtener usuarios por área
router.get("/user/:id_area", obtenerPersonalxArea);

// PUT: Actualizar registro de llamada
router.put("/:id", UpdateRegistroLlamadas);

// POST: Cambiar estado
router.post("/cambiarEstado", cambioEstado);

// POST: Marcar envío WhatsApp
router.post("/uptEstadoEnvioWsp", updateEstadoEnvioWsp);

// ✅ GET: Obtener reporte de llamadas por fecha
router.get("/reporte", getReporteLLamadas);

module.exports = router;
