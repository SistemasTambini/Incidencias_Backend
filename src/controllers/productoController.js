const fs = require("fs");
const path = require("path");
const Producto = require("../models/producto");
const EtiquetaQR = require("../models/etiquetaQR");
const { QueryTypes } = require('sequelize'); 
const sequelize = require('../config/dbConfig'); // Conexión a la base de datos

// Crear un producto
const crearProducto = async (req, res) => {
  const {
    Nombre,
    Descripcion,
    ID_Categoria,
    Marca,
    Modelo,
    Numero_Serie,
    Cantidad,
    Estado,
  } = req.body;

  try {
    let Url_image = null;

    if (req.file) {
      const imageName = `product-${Date.now()}-${req.file.originalname}`;
      const targetPath = path.join(
        process.cwd(),
        "public",
        "assets",
        "productos",
        imageName
      );

      try {
        fs.renameSync(req.file.path, targetPath);
        Url_image = `http://192.168.1.200:3000/assets/productos/${imageName}`;
      } catch (fsError) {
        return res.status(500).json({
          mensaje: "Error al guardar la imagen",
          error: fsError.message,
        });
      }
    }

    const producto = await Producto.create({
      Nombre,
      Descripcion,
      ID_Categoria,
      Marca,
      Modelo,
      Numero_Serie,
      Cantidad,
      Estado,
      Url_image,
    });

    const etiquetaQR = await EtiquetaQR.create({
      Codigo: "Código generado", // Asegúrate de generar un código único aquí
      URL_Info_Equipo: `http://192.168.1.200:3000/api/producto/${producto.ID_Producto}`,
      Fecha_Generacion: new Date(),
      ID_Producto: producto.ID_Producto,
    });

    res.status(201).json({
      mensaje: "Producto y QR creados exitosamente",
      producto,
      etiquetaQR,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear el producto",
      error: error.message,
    });
  }
};


// Obtener un producto por ID
const getProductoById = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findOne({
      where: { ID_Producto: id },
    });

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el producto",
      error: error.message,
    });
  }
};

const MostrarListadoProducto = async (req, res) =>{
  try {
    // Ejecutamos el procedimiento almacenado
    const result = await sequelize.query('CALL sp_mostrar_ListadoProductos()', {
      type: QueryTypes.SELECT, // Especificamos que esperamos un resultado
    });

    // Si obtenemos resultados
    if (result && result.length > 0) {
      
      const data = result[0]; // `result[0]` debería contener el primer conjunto de datos

      return res.status(200).json(data); // Devolvemos los resultados como JSON
    } else {
      return res.status(404).json({ message: 'No se encontraron datos.' });
    }
  } catch (error) {
    console.error('Error al ejecutar el procedimiento almacenado:', error);
    return res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado.' });
  }
};

// Función para guardar QR
const guardarQR = async (req, res) => {
  const { ID_Producto } = req.body;

  try {
    // Verificar si existe un archivo adjunto
    if (!req.file) {
      return res.status(400).json({ mensaje: "No se ha adjuntado ningún archivo QR." });
    }

    // Generar la ruta donde se almacenará el QR
    const qrName = `QR-${Date.now()}-${req.file.originalname}`;
    const qrPath = path.join(process.cwd(), "public", "assets", "QR", qrName);

    // Mover el archivo a la carpeta de QR
    fs.renameSync(req.file.path, qrPath);

    const qrUrl = `http://192.168.1.200:3000/assets/QR/${qrName}`;

    // Buscar el producto por ID
    const producto = await Producto.findOne({ where: { ID_Producto } });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    // Actualizar la columna QR_Code en la base de datos
    producto.QR_Code = qrUrl;
    await producto.save();

    res.status(200).json({
      mensaje: "QR guardado exitosamente",
      producto,
      QR_Code: qrUrl,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al guardar el QR",
      error: error.message,
    });
  }
};

const editarProducto = async (req, res) => {
  const { ID_Producto } = req.params; // Obtener el ID del producto desde los parámetros
  const {
    Nombre,
    Descripcion,
    ID_Categoria,
    Marca,
    Modelo,
    Numero_Serie,
    Cantidad,
  } = req.body; // Datos enviados en el cuerpo de la solicitud

  try {
    // Verificar si el producto existe
    const producto = await Producto.findOne({ where: { ID_Producto } });
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    // Actualizar los datos del producto
    producto.Nombre = Nombre || producto.Nombre;
    producto.Descripcion = Descripcion || producto.Descripcion;
    producto.ID_Categoria = ID_Categoria || producto.ID_Categoria;
    producto.Marca = Marca || producto.Marca;
    producto.Modelo = Modelo || producto.Modelo;
    producto.Numero_Serie = Numero_Serie || producto.Numero_Serie;
    producto.Cantidad = Cantidad || producto.Cantidad;

    await producto.save(); // Guardar los cambios en la base de datos

    res.status(200).json({
      mensaje: "Producto actualizado exitosamente.",
      producto,
    });
  } catch (error) {
    console.error("Error al editar el producto:", error);
    res.status(500).json({
      mensaje: "Error al editar el producto.",
      error: error.message,
    });
  }
};

const eliminarProducto = async (req, res) => {
  const { ID_Producto } = req.params; // Obtener el ID del producto desde los parámetros

  try {
    // Verificar si el producto existe
    const producto = await Producto.findOne({ where: { ID_Producto } });
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    // Cambiar el estado a 0 (desactivado)
    producto.Estado = 0;

    await producto.save(); // Guardar los cambios en la base de datos

    res.status(200).json({
      mensaje: "Producto eliminado (desactivado) exitosamente.",
      producto,
    });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({
      mensaje: "Error al eliminar el producto.",
      error: error.message,
    });
  }
};

module.exports = { crearProducto, getProductoById,MostrarListadoProducto,guardarQR,editarProducto,eliminarProducto};
