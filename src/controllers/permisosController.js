const sequelize = require("../config/dbConfig"); // Conexión a la base de datos

// Obtener permisos usando el Stored Procedure
const getUserPermissions = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: "ID de usuario no proporcionado" });
        }

        const userId = req.user.id;

        // Ejecutamos el Stored Procedure con `raw: true`
        const results = await sequelize.query("CALL GetUserPermissions(:userId)", {
            replacements: { userId },
            raw: true // Asegura que Sequelize devuelva datos en formato plano
        });

        console.log("Resultados del SP:", results);

        // Si no hay permisos, devolvemos un array vacío
        if (!results || Object.keys(results).length === 0) {
            return res.json({ permisos: [] });
        }

        res.json({ permisos: Object.values(results).map(p => p.permiso) });

    } catch (error) {
        console.error("Error obteniendo permisos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


module.exports = { getUserPermissions };
