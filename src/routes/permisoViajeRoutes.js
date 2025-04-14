const express = require('express');
const router = express.Router();
const permisoViajeController = require('../controllers/permisoViajeController');
const { uploadPermiso_viaje } = require('../utils/uploadPermiso_viaje');

// Ruta para crear un nuevo PermisoViaje
router.post('/', uploadPermiso_viaje,permisoViajeController.create);

// Ruta para obtener todos los PermisosViaje
router.get('/', permisoViajeController.getAll);

// Ruta para actualizar el PermisoViaje por código
router.put('/:codigo', permisoViajeController.update); 

module.exports = router;
