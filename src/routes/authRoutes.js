const express = require("express");
const { login } = require("../controllers/authController");
const { validateLoginFields } = require("../middleware/authMiddleware");

const router = express.Router();

// Ruta para el login
router.post("/login",validateLoginFields, login);

module.exports = router;
