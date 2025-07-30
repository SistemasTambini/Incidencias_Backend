const { sequelize } = require("../config/dbConfig");

// Controlador para obtener el reporte de correspondencias
const getReporteCorrespondencia = async (req, res) => {
  // Obtener los parámetros de fecha desde la query
  const { fechaInicio, fechaFin } = req.query;

  // Validación básica de las fechas
  if (!fechaInicio || !fechaFin) {
    return res.status(400).json({ message: 'Por favor, proporciona las fechas de inicio y fin' });
  }

  try {
   
    const [reporteCorrespondencia] = await sequelize.query(
      'CALL sp_reporteCorrespondenciaRecibida(:fechaInicio, :fechaFin)', 
      {
        replacements: { fechaInicio, fechaFin },
        type: sequelize.QueryTypes.SELECT, 
      }
    );

    // Verificar si se obtuvieron resultados
    if (!reporteCorrespondencia || reporteCorrespondencia.length === 0) {
      return res.status(404).json({ message: 'No se encontraron Correspondencia para las fechas proporcionadas.' });
    }

    // Enviar el reporte de Correspondencia como respuesta
    return res.status(200).json(reporteCorrespondencia);
  } catch (error) {
    console.error('Error al obtener el reporte de Correspondencia:', error);
    return res.status(500).json({ message: 'Error al obtener el reporte de Correspondencia.' });
  }
};

module.exports = { getReporteCorrespondencia };
