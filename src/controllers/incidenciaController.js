const sequelize = require("../config/dbConfig");
const Incidencia = require("../models/incidencia");

// Obtener todas las incidencias con el procedimiento almacenado
const getAllIncidencias = async (req, res) => {
  try {
    // Ejecutamos el procedimiento almacenado
    const [results, metadata] = await sequelize.query('CALL sp_mostrarIncidencias();', {
      type: sequelize.QueryTypes.SELECT  // Especificamos que esperamos un conjunto de resultados SELECT
    });

    

    // Devuelve los resultados obtenidos del procedimiento almacenado
    res.status(200).json(results); // Devolvemos los resultados obtenidos
  } catch (err) {
    // Manejo de errores si algo sale mal
    console.error("Error:", err);  // Log de errores
    res.status(500).json({ message: "Error al obtener las incidencias", error: err.message });
  }
};

// Crear una nueva incidencia
const createIncidencia = async (req, res) => {
  const { problema, atencion, area, tipo, fecha, prioridad, observacion } = req.body;

  // Validación de los campos requeridos
  if (!problema || !atencion || !area || !tipo || !fecha || !prioridad) {
    return res.status(400).json({ message: "Todos los campos son requeridos excepto observacion" });
  }

  try {
    // Crear la incidencia con estado por defecto como '1'
    const nuevaIncidencia = await Incidencia.create({
      problema,
      atencion,
      area,
      tipo,
      fecha,
      prioridad,
      observacion,
      estado: '1', // Establecer estado por defecto como '1'
    });

    // Responder con la incidencia creada
    res.status(201).json({ message: "Incidencia creada exitosamente", incidencia: nuevaIncidencia });
  } catch (err) {
    res.status(500).json({ message: "Error al crear la incidencia", error: err.message });
  }
};


module.exports = { getAllIncidencias, createIncidencia };
