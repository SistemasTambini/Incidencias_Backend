const express = require("express");
const router = express.Router();
const {getAllCategorias,getAllCategoriasAll,getCategoriaById} = require("../controllers/categoriaController")

// Obtener todas las categorías activas
router.get("/", getAllCategorias);

// Obtener todas las categorías (sin filtro de estado)
router.get("/categorias/all", getAllCategoriasAll);

// Obtener una categoría por ID
router.get("/categoria/:id", getCategoriaById);

module.exports = router;
