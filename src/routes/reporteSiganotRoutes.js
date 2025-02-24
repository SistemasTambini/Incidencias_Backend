const express = require('express');
const {getReporteImpresionPorPersonal} = require('../controllers/reporteSiganotController')
const router = express.Router();

router.get('/', getReporteImpresionPorPersonal)

module.exports = router;