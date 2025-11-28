// /controllers/dashboardController.js
const { sequelize } = require("../config/dbConfig"); // Conexión a la base de datos
const { QueryTypes } = require('sequelize'); // Importamos QueryTypes de Sequelize para consultas SQL crudas
const Usuario = require("../models/usuario");
const { getGMT5Date } = require('../utils/dateUtils');
const bcrypt = require("bcrypt");


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



//REGISTRAR NUEVO USUARIO TANTO LOGIN Y PARA EL USO DEL SISTEMA
const agregarPersonal = async (req, res) => {
  try {
    const { nombre, apellido,usuario,password,cargo,documento,genero,correo_coorporativo ,correo, telefono, id_area, fecha_nacimiento } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!nombre || !apellido) {
      return res.status(400).json({ message: 'Los campos nombre y apellido.' });
    }

    const existingUser = await Usuario.findOne({ where: { usuario } });
    if (existingUser) {
      return res.status(409).json({ error: "El usuario ya está registrado." });
    }
    //  Hashear contraseña antes de guardar
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear un nuevo registro con las fechas y estado por defecto
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      usuario,
      password: hashedPassword,  
      cargo,
      genero,
      correo_coorporativo,
      correo,
      documento,
      telefono,
      id_area,
      fecha_nacimiento,
      Fecha_Creacion: getGMT5Date(),
      Fecha_Modificacion: getGMT5Date(),
      Estado: 1, 
      Jefe: 0
    });

    return res.status(201).json({ message: 'Usuario agregado exitosamente.', data: nuevoUsuario });
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    return res.status(500).json({ message: 'Error al agregar usuario.', error });
  }
};

const editarPersonal = async (req, res) => {
  try {
    const { id } = req.params;

    // Desestructuramos también password
    const { 
      nombre, 
      apellido, 
      usuario, 
      cargo, 
      documento, 
      genero, 
      correo_coorporativo, 
      correo, 
      telefono, 
      id_area, 
      fecha_nacimiento,
      password // 👈 opcional
    } = req.body;

    // Buscar el registro por ID
    const usuarios = await Usuario.findByPk(id);

    if (!usuarios) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    let updateData = {
      nombre,
      apellido,
      usuario,
      cargo,
      genero,
      correo_coorporativo,
      correo,
      documento,
      telefono,
      id_area,
      fecha_nacimiento,
      Fecha_Modificacion: getGMT5Date(),
    };

    // Solo actualizar la contraseña si se mandó en el body
    if (password && password.trim() !== "") {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password = hashedPassword;
    }

    await usuarios.update(updateData);

    return res
      .status(200)
      .json({ message: "Usuario actualizado exitosamente.", data: usuarios });
  } catch (error) {
    console.error("Error al editar usuario:", error);
    return res
      .status(500)
      .json({ message: "Error al editar usuario.", error });
  }
};



const eliminarPersonal = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el registro por ID
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Invertir el estado actual
    const nuevoEstado = usuario.Estado === 1 ? 0 : 1;

    await usuario.update({
      Estado: nuevoEstado,
      Fecha_Modificacion: getGMT5Date(),
    });

    return res.status(200).json({
      message: `Usuario ${nuevoEstado === 1 ? "activado" : "desactivado"} exitosamente.`,
      usuario,
    });
  } catch (error) {
    console.error("Error al cambiar estado del usuario:", error);
    return res
      .status(500)
      .json({ message: "Error al cambiar estado del usuario.", error });
  }
};

// Obtener los datos del usuario (sin la contraseña)

const getUserData = async (req, res) => {
  const { usuario: key } = req.params;
  if (!key) return res.status(400).json({ message: "Usuario es requerido" });

  try {
    const isNumericId = /^\d+$/.test(key);
    const user = isNumericId
      ? await Usuario.findByPk(Number(key))
      : await Usuario.findOne({ where: { usuario: key } });

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    const { password, ...userData } = user.toJSON();
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los datos del usuario", error: err.message });
  }
};

  

module.exports = { getPersonal,agregarPersonal,editarPersonal,eliminarPersonal,getUserData }