// src/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const errorHandler = require("./middleware/errorHandler");
const { verifyToken } = require("./middleware/authMiddleware"); 
const allRoutes = require("./routes/allRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), "public")));

// Rutas públicas (login y registro)
app.use("/api/auth", require("./routes/authRoutes"));

// 🔒 Todas las demás rutas protegidas
app.use("/api", verifyToken, allRoutes);

// Middleware de errores
app.use(errorHandler);

module.exports = app;
