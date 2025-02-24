const express = require("express");
const { getAllAreas,getAllCargos, getAllTiposIncidencias } = require("../controllers/areaController");

const router = express.Router();

// Ruta para obtener todas las áreas
router.get("/", getAllAreas);
router.get("/allcargos",getAllCargos)
router.get("/alltipinc",getAllTiposIncidencias)

module.exports = router;
