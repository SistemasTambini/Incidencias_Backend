const { sequelize } = require("../config/dbConfig"); 

// Middleware para verificar permisos
const checkPermission = (permisoRequerido) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(400).json({ error: "ID de usuario no proporcionado" });
            }

            const userId = req.user.id; // ID del usuario autenticado desde el token

            // Llamar al Stored Procedure para obtener los permisos del usuario
            const [results] = await sequelize.query("CALL GetUserPermissions(:userId)", {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT,
            });

            const permisos = results.map(p => p.permiso);

            // Verificar si el usuario tiene el permiso requerido
            if (!permisos.includes(permisoRequerido)) {
                return res.status(403).json({ error: "No tienes permiso para acceder a esta función." });
            }

            next(); // Permitir el acceso si tiene el permiso

        } catch (error) {
            console.error("Error verificando permisos:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    };
};

module.exports = checkPermission;
