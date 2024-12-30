const express = require("express");
const { getAllAreas,getAllCargos } = require("../controllers/areaController");

const router = express.Router();

// Ruta para obtener todas las áreas
router.get("/", getAllAreas);
router.get("/allcargos",getAllCargos)

module.exports = router;
