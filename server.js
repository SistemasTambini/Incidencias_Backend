// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const { sequelize, sequelize2 } = require("./src/config/dbConfig"); // <-- ahora importamos así

// Rutas
const areaRoutes = require("./src/routes/areaRoutes");
const incidenciaRoutes = require("./src/routes/incidenciaRoutes");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const reporteRoutes = require("./src/routes/reporteRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const categoriaRoutes = require("./src/routes/categoriaRoutes");
const productoRoutes = require("./src/routes/productoRoutes");
const personalRoutes = require("./src/routes/personalRoutes");
const asignacionRoutes = require("./src/routes/asingacionRoutes");
const empresaRoutes = require("./src/routes/empresaRoutes");
const siganotRoutes = require("./src/routes/reporteSiganotRoutes");
const agendaRoutes = require("./src/routes/agendaRoutes");
const permisoRoutes = require("./src/routes/permisosRoutes");
const recordatorioRoutes = require("./src/routes/recordatorioRoutes");
const permiso_aplicativoRoutes = require("./src/routes/permisoAplicativosRoutes");
const correspondeciaRoutes = require("./src/routes/correspondenciaRoutes");
const calificacionRoutes = require("./src/routes/calificacionRoutes");
const permisoViajeRoutes = require("./src/routes/permisoViajeRoutes");
const registroLLamadas = require("./src/routes/registroLLamadasRoutes");

const errorHandler = require("./src/middleware/errorHandler");

const app = express();
const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;

// Middlewares base
app.use(cors());
app.use(bodyParser.json());

// Rutas (las dejamos como están de momento)
app.use("/api/areas", areaRoutes);
app.use("/api/incidencias", incidenciaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reporte", reporteRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categoria", categoriaRoutes);
app.use("/api/producto", productoRoutes);
app.use("/api/personal", personalRoutes);
app.use("/api/asignacion", asignacionRoutes);
app.use("/api/empresa", empresaRoutes);
app.use("/api/siganot", siganotRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/permiso", permisoRoutes);
app.use("/api/permiso_aplicativo", permiso_aplicativoRoutes);
app.use("/api/correspondencia", correspondeciaRoutes);
app.use("/api/calificacion", calificacionRoutes);
app.use("/api/permiso_viaje", permisoViajeRoutes);
app.use("/api/registroLLamadas", registroLLamadas);
app.use("/api", recordatorioRoutes);

app.use(express.static(path.join(process.cwd(), "public")));

// Middleware de errores
app.use(errorHandler);

// Ruta base
app.get("/", (req, res) => {
  res.send("¡API de DB Incidencias corriendo!");
});

// Conexión BD y levantar servidor
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la BD principal");
    await sequelize2.authenticate();
    console.log("✅ Conectado a la BD secundaria");

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar con la BD:", error.message);
    process.exit(1); // salir si no conecta
  }
})();
