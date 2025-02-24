const { sequelize2 } = require('../config/dbConfig'); // Conexión a la segunda base de datos
const { QueryTypes } = require('sequelize'); // Importar tipos de consulta

// Controlador para obtener el reporte de impresión por personal
const getReporteImpresionPorPersonal = async (req, res) => {
  // Obtener los parámetros de fecha y el código de usuario desde la query
  const { fechaIni, fechaFin, codigo } = req.query;

  // Validación básica de los parámetros
  if (!fechaIni || !fechaFin || !codigo) {
    return res.status(400).json({
      message: 'Por favor, proporciona las fechas de inicio, fin y el código de usuario.',
    });
  }

  try {
    // Llamada al procedimiento almacenado `sp_listar_impresion_por_personal`
    const reporteImpresion = await sequelize2.query(
      'CALL sp_listar_impresion_por_personal(:fechaIni, :fechaFin, :codigo)',
      {
        replacements: { fechaIni, fechaFin, codigo },
        type: QueryTypes.SELECT, // Tipo de consulta RAW para procedimientos almacenados
      }
    );

    // Verificar si se obtuvieron resultados
    if (!reporteImpresion || reporteImpresion.length === 0) {
      return res.status(404).json({
        message: 'No se encontraron datos de impresión para los parámetros proporcionados.',
      });
    }

    // Enviar el reporte de impresión como respuesta
    return res.status(200).json(reporteImpresion);
  } catch (error) {
    console.error('Error al obtener el reporte de impresión por personal:', error);
    return res.status(500).json({
      message: 'Error al obtener el reporte de impresión por personal.',
    });
  }
};

// Exportar el controlador
module.exports = { getReporteImpresionPorPersonal };
