const express = require('express');
const { getEmpresa, agregarEmpresa, editarEmpresa, eliminarEmpresa } = require('../controllers/empresaController');
const router = express.Router();

router.get('/', getEmpresa);
router.post('/', agregarEmpresa);
router.put('/:id', editarEmpresa);
router.delete('/:id', eliminarEmpresa);

module.exports = router;