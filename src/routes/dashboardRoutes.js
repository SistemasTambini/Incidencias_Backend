// /routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();

// Importamos la función del controlador
const { getCombosIncidencia,getIncidenciasxCantidad,getIncidenciaxArea,getIncidenciaxPrioridad,getTipoxPrioridad,getIncidenciaxFechaTipo, getAreaxPrioridad } = require("../controllers/dashboardController");

// Ruta para obtener los combos de incidencias
router.get("/combos-incidencia", getCombosIncidencia);
router.get("/incidenciasxcantidad", getIncidenciasxCantidad);
router.get("/incidenciaxarea",getIncidenciaxArea);
router.get("/incidenciaxprioridad", getIncidenciaxPrioridad);
router.get("/tipoxprioridad",getTipoxPrioridad);
router.get("/incidenciaxfechatipo",getIncidenciaxFechaTipo);
router.get("/areaxPrioridad",getAreaxPrioridad);

// Exportamos el router para ser utilizado en el servidor
module.exports = router;
