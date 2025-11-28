
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig'); // IMPORTANTE: destructurar la instancia correcta

const getAsesores = async (req, res) => {
  try {
    const query = `
        SELECT 
          ar.id AS areaID,
          ar.nombre AS nombre_area,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id_asesor', a.id,
              'nombres_asesor', CONCAT(a.nombre, ' ', a.apellido),
              'correo_coorporativo', a.correo_coorporativo,
              'telefono', a.telefono
            )
          ) AS asesores
        FROM usuario a
        LEFT JOIN area ar ON ar.id = a.id_area
        WHERE a.Estado = 1
        GROUP BY ar.id, ar.nombre
        ORDER BY ar.nombre;

    `;

    const asesores = await sequelize.query(query, { type: QueryTypes.SELECT });
    res.status(200).json(asesores);
  } catch (error) {
    console.error("Error al obtener los asesores:", error);
    res.status(500).json({ message: 'Error al ejecutar la consulta controller', error: error.message });
  }
};

module.exports = { getAsesores };
