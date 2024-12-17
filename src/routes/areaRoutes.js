const express = require("express");
const { getAllAreas } = require("../controllers/areaController");

const router = express.Router();

// Ruta para obtener todas las áreas
router.get("/", getAllAreas);

module.exports = router;
