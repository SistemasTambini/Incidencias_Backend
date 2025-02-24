const express = require("express");
const router = express.Router();
const { getUserPermissions } = require("../controllers/permisosController");
const { verifyToken } = require("../middleware/authMiddleware"); // Importamos tu middleware

// Ruta protegida: Obtiene los permisos del usuario autenticado
router.get("/", verifyToken, getUserPermissions);

module.exports = router;
