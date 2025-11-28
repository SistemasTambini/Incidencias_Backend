const fs = require("fs");
const path = require("path");
const Producto = require("../models/producto");
const EtiquetaQR = require("../models/etiquetaQR");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../config/dbConfig"); // Conexión a la base de datos
const { generarQRArchivo } = require('../utils/generarQR');

// Usa .env si quieres (ej. BASE_PUBLIC_URL=http://192.168.1.200:3000)
const BASE_PUBLIC_URL = process.env.BASE_PUBLIC_URL || 'http://192.168.1.20:3000';

// Crear un producto
const crearProducto = async (req, res) => {
  const {
    Nombre,
    Descripcion,
    ID_Categoria,
    Marca,
    Modelo,
    // Numero_Serie,
    Tipo,
    Valor_Activo,
    Cantidad,
    Estado,
  } = req.body;

  try {
    // Obtener la fecha en GMT-5
    const now = new Date();
    const fechaGMT5 = new Date(now.getTime() - 5 * 60 * 60 * 1000); // Restar 5 horas

    // Crear el producto en la base de datos
    const producto = await Producto.create({
      Nombre,
      Descripcion,
      ID_Categoria,
      Marca,
      Modelo,
      // Numero_Serie,
      Cantidad,
      Tipo,
      Valor_Activo,
      Estado,
      Fecha_creacion: fechaGMT5, // Agregar la fecha de creación
      Url_image: null, // Inicialmente vacío
    });

    let Url_image = null;

    // Procesar la imagen si está presente
    if (req.file) {
      const imageName = `Producto-${producto.ID_Producto}${path.extname(req.file.originalname)}`;
      const targetPath = path.join(
        process.cwd(),
        "public",
        "assets",
        "productos",
        imageName
      );

      try {
        // Mover la imagen a la ubicación final
        fs.renameSync(req.file.path, targetPath);
        Url_image = `http://192.168.1.20:3000/assets/productos/${imageName}`;

        // Actualizar la URL de la imagen en la base de datos
        producto.Url_image = Url_image;
        await producto.save();
      } catch (fsError) {
        return res.status(500).json({
          mensaje: "Error al guardar la imagen",
          error: fsError.message,
        });
      }
    }

    // Crear la etiqueta QR
    const etiquetaQR = await EtiquetaQR.create({
      Codigo: `QR-${producto.ID_Producto}`,
      URL_Info_Equipo: `http://192.168.1.20:3000/api/producto-public/${producto.ID_Producto}`,
      Fecha_Generacion: fechaGMT5,
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

const MostrarListadoProducto = async (req, res) => {
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

    // Buscar el producto por ID
    const producto = await Producto.findOne({ where: { ID_Producto } });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    // Generar el nombre del archivo QR con el formato QR-ID_Producto
    const qrName = `QR-${ID_Producto}${path.extname(req.file.originalname)}`; // QR-ID_Producto.ext
    const qrPath = path.join(process.cwd(), "public", "assets", "QR", qrName);

    // Mover el archivo a la carpeta de QR
    fs.renameSync(req.file.path, qrPath);

    const qrUrl = `http://192.168.1.20:3000/assets/QR/${qrName}`;

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

async function crearQR(req, res) {
  try {
    const { data, productoId, overwrite = true, nombre } = req.body || {};

    if (!data || !String(data).trim()) {
      return res.status(400).json({ mensaje: 'El campo "data" es requerido.' });
    }

    // Si viene productoId, validamos y preparamos nombre estándar
    let producto = null;
    let nombreArchivo = nombre;
    if (productoId) {
      producto = await Producto.findOne({ where: { ID_Producto: productoId } });
      if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado.' });
      }
      // Nombre por defecto si no envían uno
      nombreArchivo = nombreArchivo || `QR-${producto.ID_Producto}.png`;
    } else {
      // Si no hay producto, también garantizamos un nombre
      const slug = (nombre && String(nombre).trim()) || `QR-${Date.now()}.png`;
      nombreArchivo = slug.endsWith('.png') ? slug : `${slug}.png`;
    }

    // Generar archivo PNG
    await generarQRArchivo({
      data: String(data),
      nombreArchivo,
      carpetaRelativa: ['public', 'assets', 'QR'],
    });

    const urlPublica = `${BASE_PUBLIC_URL}/assets/QR/${nombreArchivo}`;

    // Si hay producto, actualizamos su QR_Code (respetando overwrite)
    let etiquetaQR = null;
    if (producto) {
      if (overwrite || !producto.QR_Code) {
        producto.QR_Code = urlPublica;
        await producto.save();
      }
      // Crear/actualizar EtiquetaQR (opcional)
      etiquetaQR = await EtiquetaQR.findOne({ where: { ID_Producto: producto.ID_Producto } });
      if (!etiquetaQR) {
        etiquetaQR = await EtiquetaQR.create({
          Codigo: `QR-${producto.ID_Producto}`,
          URL_Info_Equipo: String(data),
          Fecha_Generacion: new Date(),
          ID_Producto: producto.ID_Producto,
        });
      } else {
        etiquetaQR.URL_Info_Equipo = String(data);
        etiquetaQR.Fecha_Generacion = new Date();
        await etiquetaQR.save();
      }
    }

    return res.status(201).json({
      mensaje: 'QR generado y almacenado correctamente.',
      file: {
        name: nombreArchivo,
        url: urlPublica,
        path: `/assets/QR/${nombreArchivo}`,
      },
      producto: producto || undefined,
      etiquetaQR: etiquetaQR || undefined,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error al generar el QR',
      error: error.message,
    });
  }
}



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
    Tipo,
    Valor_Activo,
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
    producto.Tipo= Tipo || producto.Tipo;
    producto.Valor_Activo=Valor_Activo || producto.Valor_Activo;

    // Actualizar la fecha de modificación en GMT-5
    const now = new Date();
    producto.Fecha_modificacion = new Date(now.getTime() - 5 * 60 * 60 * 1000);

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

    // Actualizar la fecha de modificación en GMT-5
    const now = new Date();
    producto.Fecha_modificacion = new Date(now.getTime() - 5 * 60 * 60 * 1000);

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


//  Endpoint público para visualizar el QR SIN token
const getProductoPublicById = async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findOne({
      where: { ID_Producto: id },
    });

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.status(200).json({
      ID_Producto: producto.ID_Producto,
      Nombre: producto.Nombre,
      Descripcion: producto.Descripcion,
      Marca: producto.Marca,
      Modelo: producto.Modelo,
      Numero_Serie: producto.Numero_Serie,
      Cantidad: producto.Cantidad,
      Estado: producto.Estado,
      Url_image: producto.Url_image,
      Fecha_creacion: producto.Fecha_creacion,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener producto público",
      error: error.message,
    });
  }
};

module.exports = {
  crearProducto,
  getProductoById,
  MostrarListadoProducto,
  guardarQR,
  editarProducto,
  eliminarProducto,
  crearQR,
  getProductoPublicById, // 👈 agregado
};




module.exports = { crearProducto, getProductoById, MostrarListadoProducto, guardarQR, editarProducto, eliminarProducto,crearQR, getProductoPublicById };
