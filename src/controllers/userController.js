const Personal = require("../models/personal");
const sequelize = require("../config/dbConfig"); 


const getAllUsuarios = async (req, res) => {
  try {
    // Obtener todos los usuarios con nombre y apellido concatenados
    const usuarios = await Personal.findAll({
      attributes: [
        [sequelize.literal("CONCAT(nombre, ' ', apellido)"), "nombreCompleto"], // Crear el campo 'nombreCompleto'
      ],
    })

    // Verificar si no se encontraron usuarios
    if (usuarios.length === 0) {
      return res.status(404).json({ message: "No se encontraron usuarios" });
    }

    // Retornar los usuarios con el nombre completo
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los usuarios", error: err.message });
  }
};

module.exports = { getAllUsuarios };
