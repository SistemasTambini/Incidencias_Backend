const Area = require("../models/area");

// Obtener todas las áreas
const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.findAll(); // Consulta todas las áreas
    res.status(200).json(areas);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener las áreas", error: err.message });
  }
};

module.exports = { getAllAreas };
