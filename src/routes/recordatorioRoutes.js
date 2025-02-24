const express = require('express');
const router = express.Router();
const { getListarUsuarioRecordatorio, getLitadoCliente } = require('../controllers/recordatorioController');


// Ruta GET para obtener los recordatorios por tipo
router.get('/recordatorios', getListarUsuarioRecordatorio);
router.get('/listarclientesiganot', getLitadoCliente);

module.exports = router;
