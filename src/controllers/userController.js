const Personal = require("../models/personal");
const Cargo = require("../models/cargo")
const sequelize = require("../config/dbConfig"); 

// Obtener todos los usuarios activos (estado = 1) con nombre y apellido concatenados
const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Personal.findAll({
      attributes: [
        [sequelize.literal("CONCAT(nombre, ' ', apellido)"), "nombreCompleto"],
      ],
      where: {
        estado: 1,
        cargo:1  // Filtra solo los usuarios con estado = 1
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

const getAllUsuario = async (req, res) => {
  try {
    // Consulta el personal donde el estado sea igual a 1 e incluye el nombre del área desde Cargo
    const personal = await Personal.findAll({
      //where: { estado: 1 },
      include: [
        {
          model: Cargo, // Modelo relacionado
          attributes: ["nombre"], // Solo selecciona el campo 'nombre' de Cargo
        },
      ],
    });

    // Mapea los resultados para ajustar el formato de la respuesta
    const formattedPersonal = personal.map((p) => ({
      id: p.id,
      usuario: p.usuario,
      nombre: p.nombre,
      apellido: p.apellido,
      documento: p.documento,
      correo: p.correo,      
      cargo: p.Cargo?.nombre || null, // Reemplaza cargo:1 por el nombre del cargo
      estado: p.estado,
    }));

    res.status(200).json(formattedPersonal); // Envía la respuesta formateada
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener el personal",
      error: err.message,
    });
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

const updateUser = async (req, res) => {
  const { usuario } = req.params;
  const { nombre, apellido, correo, estado } = req.body;

  try {
    // Buscar el usuario por nombre de usuario
    const user = await Personal.findOne({ where: { usuario } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si se recibe un campo 'nombre', actualizarlo
    if (nombre) user.nombre = nombre;

    // Si se recibe un campo 'apellido', actualizarlo
    if (apellido) user.apellido = apellido;

    // Si se recibe un campo 'correo', actualizarlo
    if (correo) user.correo = correo;

    // Si se recibe un campo 'estado', actualizarlo
    if (estado !== undefined) user.estado = estado;

    // Guardar los cambios
    await user.save();

    // Retornar un mensaje de éxito
    res.status(200).json({ message: "Usuario actualizado exitosamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el usuario", error: err.message });
  }
};

const updateUserState = async (req, res) => {
  const { usuario } = req.params;
  const { estado } = req.body;

  if (estado === undefined) {
    return res.status(400).json({ message: "El estado es requerido" });
  }

  try {
    // Buscar el usuario por nombre de usuario
    const user = await Personal.findOne({ where: { usuario } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar solo el estado del usuario
    user.estado = estado;

    // Guardar los cambios
    await user.save();

    // Retornar un mensaje de éxito
    res.status(200).json({ message: "Estado del usuario actualizado exitosamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar el estado del usuario", error: err.message });
  }
};




const postUser = async (req, res) => {
  const { usuario, nombre, apellido, correo, password, cargo } = req.body;

  // Verificar que los campos requeridos estén presentes
  if (!usuario || !nombre || !apellido || !correo || !password || !cargo) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    // Verificar si el usuario ya está registrado
    const existingUser = await Personal.findOne({ where: { usuario } });
    if (existingUser) {
      return res.status(409).json({ error: "El usuario ya está registrado." });
    }

    // Verificar si el correo ya está registrado
    const existingEmail = await Personal.findOne({ where: { correo } });
    if (existingEmail) {
      return res.status(409).json({ error: "El correo ya está registrado." });
    }

    // Crear el nuevo usuario
    const newUser = await Personal.create({
      usuario,
      nombre,
      apellido,
      correo,
      password,
      cargo,
      estado: "1", // Estado por defecto
    });

    return res.status(201).json({ message: "Usuario creado exitosamente.", newUser });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return res.status(500).json({ error: "Error al crear el usuario." });
  }
};




module.exports = { getAllUsuario,getAllUsuarios, getUserData, changePassword, updateUser,postUser,updateUserState };
