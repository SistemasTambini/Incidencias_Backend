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
  getReporteLLamadas
 
} = require("../controllers/registroLLamadasController");

const {
  getRegistroxUsuario,
  getRegLlamadaxAreaEstado,
  getRegistroPorcentajexArea,
  getRegLlamadaxTipoxAsesor
}= require("../controllers/dashboardRegLlamadaController");

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

// 📊 Dashboard
router.get("/dashboard/registrosxusu/", getRegistroxUsuario);
router.get("/dashboard/registros/", getRegLlamadaxAreaEstado);
router.get("/dashboard/regis_pend_porc/", getRegistroPorcentajexArea);
router.get("/dashboard/regis_pend_tipo_asesor/", getRegLlamadaxTipoxAsesor);

module.exports = router;
