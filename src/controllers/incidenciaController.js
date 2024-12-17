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

module.exports = { getAllIncidencias };
