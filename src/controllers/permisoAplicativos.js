
const CargoPermiso = require('../models/CargoPermiso');
const Permiso = require('../models/Permiso');
const { Op } = require('sequelize');
// Obtener permisos asignados a un cargo
exports.getPermisosByCargo = async (req, res) => {
    try {
        const { cargo_id } = req.params;
        const permisos = await CargoPermiso.findAll({
            where: { cargo_id, estado: 1 },
            attributes: ['permiso_id', 'estado'],
            include: [{
                model: Permiso,
                attributes: ['nombre', 'descripcion']
            }]
        });
        res.json(permisos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Guardar permisos para un cargo (activar/desactivar permisos sin duplicar)
exports.updatePermisos = async (req, res) => {
    try {
        const { cargo_id, permisos } = req.body;

        // Desactivar permisos que no estén en la lista enviada
        await CargoPermiso.update(
            { estado: 0 },
            { where: { cargo_id, permiso_id: { [Op.notIn]: permisos } } }
        );

        // Activar permisos o insertarlos si no existen
        await Promise.all(permisos.map(async permiso_id => {
            await CargoPermiso.findOrCreate({
                where: { cargo_id, permiso_id },
                defaults: { estado: 1 }
            });
            await CargoPermiso.update(
                { estado: 1 },
                { where: { cargo_id, permiso_id } }
            );
        }));
        
        res.json({ message: 'Permisos actualizados correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener todos los permisos disponibles
exports.getAllPermisos = async (req, res) => {
    try {
        const permisos = await Permiso.findAll({
            attributes: ['id', 'nombre', 'descripcion']
        });
        res.json(permisos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
