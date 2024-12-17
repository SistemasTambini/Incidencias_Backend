const Personal = require("../models/personal");
const bcrypt = require("bcrypt");

// Login de usuario
const login = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    // Buscar el usuario en la base de datos
    const user = await Personal.findOne({ where: { usuario } });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar las contraseñas con bcrypt
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Login exitoso
    res.status(200).json({ message: "Login exitoso", user });
  } catch (err) {
    res.status(500).json({ message: "Error al iniciar sesión", error: err.message });
  }
};

module.exports = { login };
