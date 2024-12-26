const Personal = require("../models/personal");
const sequelize = require("../config/dbConfig"); 

// Obtener todos los usuarios activos (estado = 1) con nombre y apellido concatenados
const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Personal.findAll({
      attributes: [
        [sequelize.literal("CONCAT(nombre, ' ', apellido)"), "nombreCompleto"],
      ],
      where: {
        estado: 1,  // Filtra solo los usuarios con estado = 1
      }
    });

    if (usuarios.length === 0) {
      return res.status(404).json({ message: "No se encontraron usuarios activos" });
    }

    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los usuarios", error: err.message });
  }
};

// Obtener los datos del usuario (sin la contraseña)

const getUserData = async (req, res) => {
  const { usuario } = req.params;

  if (!usuario) {
    return res.status(400).json({ message: "Usuario es requerido" });
  }

  try {
    const user = await Personal.findOne({ where: { usuario } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { password, ...userData } = user.toJSON();  // Excluimos la contraseña
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los datos del usuario", error: err.message });
  }
};

// Función para cambiar la contraseña
const changePassword = async (req, res) => {
  const { usuario, passwordActual, nuevaPassword } = req.body;

  if (!usuario || !passwordActual || !nuevaPassword) {
    return res.status(400).json({ message: "Usuario, contraseña actual y nueva contraseña son requeridos" });
  }

  try {
    const user = await Personal.findOne({ where: { usuario } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.password !== passwordActual) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }

    user.password = nuevaPassword;
    await user.save();

    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al cambiar la contraseña", error: err.message });
  }
};

// Función para actualizar los datos del usuario (sin cambiar la contraseña)
const updateUser = async (req, res) => {
  const { usuario } = req.params;
  const { nombre, apellido, correo, estado } = req.body;

  if (!usuario || !nombre || !apellido || !correo || estado === undefined) {
    return res.status(400).json({ message: "Nombre, apellido, correo y estado son requeridos" });
  }

  try {
    // Buscar el usuario por nombre de usuario
    const user = await Personal.findOne({ where: { usuario } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar los datos del usuario
    user.nombre = nombre;
    user.apellido = apellido;
    user.correo = correo;
    user.estado = estado;  // Puede ser 1 o 0 dependiendo si el usuario está activo o inactivo

    // Guardar los cambios
    await user.save();

    // Retornar un mensaje de éxito
    res.status(200).json({ message: "Usuario actualizado exitosamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el usuario", error: err.message });
  }
};

module.exports = { getAllUsuarios, getUserData, changePassword, updateUser };
