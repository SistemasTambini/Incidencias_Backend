const Personal = require("../models/personal");

// Login de usuario
const login = async (req, res) => {
  const { usuario, password } = req.body;

  // Verificar si los campos 'usuario' y 'password' están presentes
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

    // Login exitoso
    res.status(200).json({ message: "Login exitoso", user });
  } catch (err) {
    res.status(500).json({ message: "Error al iniciar sesión", error: err.message });
  }
};

module.exports = { login };
