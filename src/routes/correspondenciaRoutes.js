const express = require("express");
const router = express.Router();
const {getCorrespondencia,postRegistro,updateEntrega,updateCorrespondencia} = require("../controllers/correspondencia/correspondenciaController")
const { uploadCorrespondencia } = require("../utils/uploadCorrespondencia");


// Rutas de correspondencia
router.get("/", getCorrespondencia);
router.post("/",uploadCorrespondencia ,postRegistro);
router.post("/uptEntrega", updateEntrega);
router.put("/uptCorre", uploadCorrespondencia,updateCorrespondencia);

module.exports = router;
