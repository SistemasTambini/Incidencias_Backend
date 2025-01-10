const express = require("express");
const router = express.Router();
const { uploadProductImage, uploadQRCode } = require("../utils/uploadImage");
const {
  crearProducto,
  getProductoById,
  MostrarListadoProducto,
  guardarQR,
  editarProducto,
  eliminarProducto,
} = require("../controllers/productoController");

// Rutas estáticas primero (orden jerárquico)
router.post("/guardarQR", uploadQRCode, guardarQR); // Guardar QR debe ir antes de las dinámicas
router.post("/", uploadProductImage, crearProducto); // Crear producto
router.get("/listado_productos", MostrarListadoProducto); // Obtener el listado de productos

// Rutas dinámicas después (orden más específico)
router.get("/:id", getProductoById); // Obtener un producto por ID
router.put("/:ID_Producto", editarProducto); // Ruta para editar un producto
router.delete("/:ID_Producto", eliminarProducto); // Ruta para eliminar (desactivar) un producto

module.exports = router;
