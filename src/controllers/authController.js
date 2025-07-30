const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Personal = require("../models/personal");
const Cargo = require("../models/cargo");

const login = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
  }

  try {
    // Buscar el usuario y traer su cargo
    const user = await Personal.findOne({
      where: { usuario, estado: 1 },
      include: [{ model: Cargo, attributes: ["nombre"] }]
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseña encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Obtener nombre del cargo
    const cargoNombre = user.Cargo ? user.Cargo.nombre : "Sin cargo";

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        usuario: user.usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        cargo: cargoNombre // Incluimos el cargo
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Respuesta con token y datos
    res.status(200).json({
      message: "Login exitoso",
      token,
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      usuario: user.usuario,
      cargo: cargoNombre
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al iniciar sesión",
      error: err.message
    });
  }
};

module.exports = { login };
