// src/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const errorHandler = require("./middleware/errorHandler");
const { verifyToken } = require("./middleware/authMiddleware"); 
const allRoutes = require("./routes/allRoutes");

const app = express();

app.use(cors({
  origin: "*", // O especifica el dominio exacto de tu frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), "public")));

// Rutas públicas (login y registro)
app.use("/api/auth", require("./routes/authRoutes"));

// 🚀 Rutas públicas que NO necesitan token
const productoController = require("./controllers/productoController");
app.get("/api/producto/public/:id", productoController.getProductoPublicById);

// 🔒 Todas las demás rutas protegidas
app.use("/api", verifyToken, allRoutes);

// Middleware de errores
app.use(errorHandler);

module.exports = app;
