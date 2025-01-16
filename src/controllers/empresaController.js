const Empresa = require('../models/empresa'); // Modelo Empresa
const sequelize = require('../config/dbConfig');
const { QueryTypes } = require('sequelize');
const { getGMT5Date } = require('../utils/dateUtils');

const getEmpresa = async (req, res) => {
    try {
      // Ejecutamos el procedimiento almacenado
      const result = await sequelize.query('CALL sp_ListadoEmpresa();', {
        type: QueryTypes.SELECT, // Especificamos que esperamos un resultado
      });
  
      // Si obtenemos resultados
      if (result && result.length > 0) {
        // Filtramos el resultado para devolver solo los datos que necesitamos
        // El resultado de la consulta es un array, por lo que eliminamos los metadatos
        // y nos quedamos solo con los datos
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

// Función para agregar una nueva empresa
const agregarEmpresa = async (req, res) => {
    try {
      const { nombre, documento, telefono, empresacol } = req.body;
  
      // Validar que los campos obligatorios estén presentes
      if (!nombre) {
        return res.status(400).json({ message: "El campo nombre es obligatorio." });
      }
  
      // Crear un nuevo registro en la tabla Empresa
      const nuevaEmpresa = await Empresa.create({
        nombre,
        documento,
        telefono,
        empresacol,
        estado: 1, // Estado activo por defecto
        fecha_Creacion: getGMT5Date(),
        fecha_Modificacion: getGMT5Date(),
      });
  
      return res.status(201).json({
        message: "Empresa agregada exitosamente.",
        data: nuevaEmpresa,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          message: `El documento ${req.body.documento} ya está registrado.`,
        });
      }
      console.error("Error al agregar empresa:", error);
      return res.status(500).json({ message: "Error al agregar empresa.", error });
    }
  };
  

// Función para editar una empresa existente
const editarEmpresa = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID desde los parámetros de la ruta
    const { nombre, documento, telefono, empresacol} = req.body;

    // Buscar la empresa por ID
    const empresa = await Empresa.findByPk(id);

    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada.' });
    }

    // Actualizar los campos de la empresa, incluyendo la fecha de modificación
    await empresa.update({
      nombre,
      documento,
      telefono,
      empresacol,
      estado : 1,
      fecha_Modificacion: getGMT5Date(),
    });

    return res.status(200).json({ message: 'Empresa actualizada exitosamente.', data: empresa });
  } catch (error) {
    console.error('Error al editar empresa:', error);
    return res.status(500).json({ message: 'Error al editar empresa.', error });
  }
};

// Función para desactivar una empresa (cambiar el estado)
const eliminarEmpresa = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID desde los parámetros de la ruta

    // Buscar la empresa por ID
    const empresa = await Empresa.findByPk(id);

    if (!empresa) {
      return res.status(404).json({ message: 'Empresa no encontrada.' });
    }

    // Cambiar el estado a "0" para marcarla como inactiva y actualizar la fecha de modificación
    await empresa.update({
      estado: 0,
      fecha_Modificacion: getGMT5Date(),
    });

    return res.status(200).json({ message: 'Empresa desactivada exitosamente.' });
  } catch (error) {
    console.error('Error al desactivar empresa:', error);
    return res.status(500).json({ message: 'Error al desactivar empresa.', error });
  }
};

module.exports = {
  getEmpresa,
  agregarEmpresa,
  editarEmpresa,
  eliminarEmpresa,
};
