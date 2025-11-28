const Categoria = require("../models/categoria");


// Crear categoria nueva
const createCategoria = async (req, res) => {
  const { Nombre, Descripcion } = req.body;

  // Validación de los campos requeridos
  if (!Nombre || !Descripcion) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    const nuevaCategoria = await Categoria.create({
      Nombre,
      Descripcion,
      Estado: '1', 
    });
    res.status(201).json({ message: "categoria creada exitosamente", categoria: nuevaCategoria });
  } catch (err) {
    res.status(500).json({ message: "Error al crear la categoria", error: err.message });
  }
};



// Obtener todas las categorías activas (estado = 1) y ordenadas por nombre de forma ascendente
const getAllCategorias = async (req, res) => {
  try {
    // Consulta las categorías donde el estado sea igual a 1 y ordénalas por nombre ascendente
    const categorias = await Categoria.findAll({
      where: { estado: 1 },  // Filtra solo las categorías con estado 1
      order: [["Nombre", "ASC"]], // Ordena por el campo 'Nombre' de forma ascendente
    });
    res.status(200).json(categorias);  // Retorna las categorías activas ordenadas
  } catch (err) {
    res.status(500).json({ message: "Error al obtener las categorías", error: err.message });
  }
};

// Obtener todas las categorías (sin filtro por estado) y ordenadas por nombre de forma ascendente
const getAllCategoriasAll = async (req, res) => {
  try {
    // Consulta todas las categorías y ordénalas por nombre ascendente
    const categorias = await Categoria.findAll({
      order: [["Nombre", "ASC"]], // Ordena por el campo 'Nombre' de forma ascendente
    });
    res.status(200).json(categorias);  // Retorna todas las categorías ordenadas
  } catch (err) {
    res.status(500).json({ message: "Error al obtener las categorías", error: err.message });
  }
};

// Obtener una categoría por ID
const getCategoriaById = async (req, res) => {
  const { id } = req.params;

  try {
    const categoria = await Categoria.findByPk(id);
    
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    res.status(200).json(categoria);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener la categoría", error: err.message });
  }
};

module.exports = { getAllCategorias, getAllCategoriasAll, getCategoriaById,createCategoria };
