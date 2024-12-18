const Incidencia = require("../models/incidencia");

// Obtener todas las incidencias
const getAllIncidencias = async (req, res) => {
  try {
    const incidencias = await Incidencia.findAll(); // Consulta todas las incidencias
    res.status(200).json(incidencias);
  } catch (err) {
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
    // Crear la incidencia
    const nuevaIncidencia = await Incidencia.create({
      problema,
      atencion,
      area,
      tipo,
      fecha,
      prioridad,
      observacion,
    });

    // Responder con la incidencia creada
    res.status(201).json({ message: "Incidencia creada exitosamente", incidencia: nuevaIncidencia });
  } catch (err) {
    res.status(500).json({ message: "Error al crear la incidencia", error: err.message });
  }
};

module.exports = { getAllIncidencias,createIncidencia };
