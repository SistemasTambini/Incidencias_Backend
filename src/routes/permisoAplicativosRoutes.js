// routes/permisoRoutes.js
const express = require('express');
const router = express.Router();
const {getPermisosByCargo,updatePermisos,getAllPermisos} = require('../controllers/permisoAplicativos');

router.get('/:cargo_id', getPermisosByCargo);
router.get('/', getAllPermisos);
router.post('/', updatePermisos);

module.exports = router;
