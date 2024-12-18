// src/routes/authRoutes.js

const express = require("express");
const { login } = require("../controllers/authController");
const { validateLoginFields } = require("../middleware/validateLoginFields"); // Importa el nuevo middleware

const router = express.Router();

// Ruta para el login: primero valida los campos, luego ejecuta el login
router.post("/login", validateLoginFields, login);

module.exports = router;

