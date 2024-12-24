const Area = require("../models/area");

// Obtener todas las áreas activas (estado = 1)
const getAllAreas = async (req, res) => {
  try {
    // Consulta las áreas donde el estado sea igual a 1
    const areas = await Area.findAll({
      where: { estado: 1 },  // Filtra solo las áreas con estado 1
    });
    res.status(200).json(areas);  // Retorna las áreas activas
  } catch (err) {
    res.status(500).json({ message: "Error al obtener las áreas", error: err.message });
  }
};

module.exports = { getAllAreas };
