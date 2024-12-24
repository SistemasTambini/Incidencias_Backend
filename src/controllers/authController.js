const Personal = require("../models/personal");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
  }

  try {
    // Buscar el usuario en la base de datos
    const user = await Personal.findOne({ where: { usuario } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar las contraseñas directamente sin encriptar
    if (user.password !== password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar el token JWT, incluyendo nombre y apellido
    const token = jwt.sign(
      { 
        id: user.id, 
        usuario: user.usuario, 
        nombre: user.nombre,
        apellido: user.apellido  // Asegúrate de que el modelo Personal tenga estos campos
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Login exitoso y enviar el token
    res.status(200).json({ message: "Login exitoso", token, nombre: user.nombre, apellido: user.apellido });
  } catch (err) {
    res.status(500).json({ message: "Error al iniciar sesión", error: err.message });
  }
};

module.exports = { login };
