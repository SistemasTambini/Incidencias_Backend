const express = require("express");
const cors = require("cors"); // Importar CORS
require("dotenv").config(); // Cargar las variables de entorno
const db = require("./src/config/dbConfig"); // Importar configuración de la base de datos

// Importar el módulo body-parser
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const areaRoutes = require("./src/routes/areaRoutes");
const incidenciaRoutes = require("./src/routes/incidenciaRoutes");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes")
const reporteRoutes = require("./src/routes/reporteRoutes")
const dashboardRoutes = require("./src/routes/dashboardRoutes")
const categoriaRoutes = require("./src/routes/categoriaRoutes")
const productoRoutes = require("./src/routes/productoRoutes")
const personalRoutes = require("./src/routes/personalRoutes")
const asignacionRoutes = require("./src/routes/asingacionRoutes")
const empresaRoutes = require("./src/routes/empresaRoutes")
const siganotRoutes = require("./src/routes/reporteSiganotRoutes")
const agendaRoutes = require("./src/routes/agendaRoutes")
const permisoRoutes = require("./src/routes/permisosRoutes")
const recordatorioRoutes = require('./src/routes/recordatorioRoutes'); 
const permiso_aplicativoRoutes = require('./src/routes/permisoAplicativosRoutes')
const correspondeciaRoutes = require('./src/routes/correspondenciaRoutes')
const calificacionRoutes = require("./src/routes/calificacionRoutes")
const permisoViajeRoutes = require("./src/routes/permisoViajeRoutes")
const registroLLamadas = require("./src/routes/registroLLamadasRoutes")


const errorHandler = require("./src/middleware/errorHandler");

// Configuración del puerto
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;

// Habilitar CORS
app.use(cors());
app.use(bodyParser.json()); // Soporte para JSON en las solicitudes


// Rutas
app.use("/api/areas", areaRoutes);
app.use("/api/incidencias", incidenciaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reporte",reporteRoutes);
app.use("/api/dashboard",dashboardRoutes)
app.use("/api/categoria",categoriaRoutes)
app.use("/api/producto",productoRoutes)
app.use("/api/personal",personalRoutes)
app.use("/api/asignacion",asignacionRoutes)
app.use("/api/empresa",empresaRoutes)
app.use("/api/siganot",siganotRoutes)
app.use("/api/agenda",agendaRoutes)
app.use("/api/permiso",permisoRoutes)
app.use("/api/permiso_aplicativo",permiso_aplicativoRoutes)
app.use("/api/correspondencia",correspondeciaRoutes)
app.use("/api/calificacion",calificacionRoutes)
app.use("/api/permiso_viaje",permisoViajeRoutes)
app.use("/api/registroLLamadas",registroLLamadas)
app.use('/api', recordatorioRoutes);
app.use(express.static(path.join(process.cwd(), "public")));

// Middleware de manejo de errores
app.use(errorHandler);

// Ruta base
app.get("/", (req, res) => {
  res.send("¡API de DB Incidencias corriendo! pipipipi");
});

// Levantar el servidor
app.listen(PORT,HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
