const express = require("express");
const router = express.Router();

const { getAsesores } = require("../controllers/asesorController");

// Ruta principal de asesores
router.get("/", getAsesores);

module.exports = router;
