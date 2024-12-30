
// module.exports = { getAllAreas };
const Area = require("../models/area");
const Cargo = require("../models/cargo")

// Obtener todas las áreas activas (estado = 1) y ordenadas por nombre de forma ascendente
const getAllAreas = async (req, res) => {

  try {
    // Consulta las áreas donde el estado sea igual a 1 y ordénalas por nombre ascendente
    const areas = await Area.findAll({
      where: { estado: 1 },  // Filtra solo las áreas con estado 1
      order: [["nombre", "ASC"]], // Ordena por el campo 'nombre' de forma ascendente
    });
    res.status(200).json(areas);  // Retorna las áreas activas ordenadas
  } catch (err) {
    res.status(500).json({ message: "Error al obtener las áreas", error: err.message });
  }
};

const getAllCargos = async (req,res) =>{
  try {
    const cargos = await Cargo.findAll({
      where: { estado: 1 },  // Filtra solo las áreas con estado 1
      order: [["nombre", "ASC"]], // Ordena por el campo 'nombre' de forma ascendente
    });
    res.status(200).json(cargos);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los cargos", error: err.message });
  }
}

module.exports = { getAllAreas,getAllCargos };
