// /controllers/dashboardController.js
const sequelize = require('../config/dbConfig'); // Conexión a la base de datos
const { QueryTypes } = require('sequelize'); // Importamos QueryTypes de Sequelize para consultas SQL crudas
const Usuario = require("../models/usuario");
const { getGMT5Date } = require('../utils/dateUtils');

// Función para consumir el procedimiento almacenado
const getPersonal = async (req, res) => {
  try {
    // Ejecutamos el procedimiento almacenado
    const result = await sequelize.query('CALL sp_mostrarUsuarios();', {
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



// Función para agregar un nuevo registro
const agregarPersonal = async (req, res) => {
  try {
    const { nombre, apellido, genero, correo, telefono, id_area } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!nombre || !apellido) {
      return res.status(400).json({ message: 'Los campos nombre y apellido.' });
    }

    // Crear un nuevo registro con las fechas y estado por defecto
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      genero,
      correo,
      telefono,
      id_area,
      Fecha_Creacion: getGMT5Date(),
      Fecha_Modificacion: getGMT5Date(),
      Estado: 1, // Estado activo por defecto
    });

    return res.status(201).json({ message: 'Usuario agregado exitosamente.', data: nuevoUsuario });
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    return res.status(500).json({ message: 'Error al agregar usuario.', error });
  }
};

// Función para editar un registro existente
const editarPersonal = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID desde los parámetros de la ruta
    const { nombre, apellido, genero, correo, telefono, id_area} = req.body;

    // Buscar el registro por ID
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Actualizar los campos del registro, incluyendo la fecha de modificación
    await usuario.update({
      nombre,
      apellido,
      genero,
      correo,
      telefono,
      id_area,
      Fecha_Modificacion: getGMT5Date(),
    });

    return res.status(200).json({ message: 'Usuario actualizado exitosamente.', data: usuario });
  } catch (error) {
    console.error('Error al editar usuario:', error);
    return res.status(500).json({ message: 'Error al editar usuario.', error });
  }
};

// Función para desactivar un usuario (cambio de estado)
const eliminarPersonal = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID desde los parámetros de la ruta

    // Buscar el registro por ID
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Cambiar el estado a "0" para marcarlo como inactivo y actualizar la fecha de modificación
    await usuario.update({
      Estado: 0,
      Fecha_Modificacion: getGMT5Date(),
    });

    return res.status(200).json({ message: 'Usuario desactivado exitosamente.' });
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    return res.status(500).json({ message: 'Error al desactivar usuario.', error });
  }
};


  

module.exports = { getPersonal,agregarPersonal,editarPersonal,eliminarPersonal }