const express = require("express");

// Importa todos tus routers aquí
const areaRoutes = require("./areaRoutes");
const incidenciaRoutes = require("./incidenciaRoutes");
const userRoutes = require("./userRoutes");
const reporteRoutes = require("./reporteRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const categoriaRoutes = require("./categoriaRoutes");
const productoRoutes = require("./productoRoutes");
const personalRoutes = require("./personalRoutes");
const asignacionRoutes = require("./asingacionRoutes");
const empresaRoutes = require("./empresaRoutes");
const siganotRoutes = require("./reporteSiganotRoutes");
const agendaRoutes = require("./agendaRoutes");
const permisoRoutes = require("./permisosRoutes");
const recordatorioRoutes = require("./recordatorioRoutes");
const permisoAplicativoRoutes = require("./permisoAplicativosRoutes");
const correspondenciaRoutes = require("./correspondenciaRoutes");
const calificacionRoutes = require("./calificacionRoutes");
const permisoViajeRoutes = require("./permisoViajeRoutes");
const registroLLamadasRoutes = require("./registroLLamadasRoutes");
const asesorRoutes = require("./asesorRoutes");

const router = express.Router();

// Montamos las rutas
router.use("/areas", areaRoutes);
router.use("/incidencias", incidenciaRoutes);
router.use("/user", userRoutes);
router.use("/reporte", reporteRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/categoria", categoriaRoutes);
router.use("/producto", productoRoutes);
router.use("/personal", personalRoutes);
router.use("/asignacion", asignacionRoutes);
router.use("/empresa", empresaRoutes);
router.use("/siganot", siganotRoutes);
router.use("/agenda", agendaRoutes);
router.use("/permiso", permisoRoutes);
router.use("/permiso_aplicativo", permisoAplicativoRoutes);
router.use("/correspondencia", correspondenciaRoutes);
router.use("/calificacion", calificacionRoutes);
router.use("/permiso_viaje", permisoViajeRoutes);
router.use("/registroLLamadas", registroLLamadasRoutes);
router.use("/asesores", asesorRoutes);
router.use("/", recordatorioRoutes);

module.exports = router;
