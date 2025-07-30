const { sequelize } = require("../config/dbConfig");

// Controlador para obtener el reporte de incidencias
const getReporteIncidencias = async (req, res) => {
  // Obtener los parámetros de fecha desde la query
  const { fechaIni, fechaFin } = req.query;

  // Validación básica de las fechas
  if (!fechaIni || !fechaFin) {
    return res.status(400).json({ message: 'Por favor, proporciona las fechas de inicio y fin' });
  }

  try {
    // Llamada al procedimiento almacenado `sp_reporteIncidencia` pasándole las fechas
    const [reporteIncidencias] = await sequelize.query(
      'CALL sp_reporteIncidencia(:fechaIni, :fechaFin)', 
      {
        replacements: { fechaIni, fechaFin },
        type: sequelize.QueryTypes.SELECT, // Usamos QueryTypes.SELECT para ejecutar la consulta
      }
    );

    // Verificar si se obtuvieron resultados
    if (!reporteIncidencias || reporteIncidencias.length === 0) {
      return res.status(404).json({ message: 'No se encontraron incidencias para las fechas proporcionadas.' });
    }

    // Enviar el reporte de incidencias como respuesta
    return res.status(200).json(reporteIncidencias);
  } catch (error) {
    console.error('Error al obtener el reporte de incidencias:', error);
    return res.status(500).json({ message: 'Error al obtener el reporte de incidencias.' });
  }
};

module.exports = { getReporteIncidencias };
