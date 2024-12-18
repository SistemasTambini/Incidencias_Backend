const express = require("express");
const { getAllUsuarios } = require("../controllers/userController");

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get("/", getAllUsuarios);

module.exports = router;
