const express = require("express");
const router = express.Router();

const {getReporteIncidencias} = require('../controllers/reporteController')

router.get("/",getReporteIncidencias)

module.exports = router;