// src/middleware/validateLoginFields.js

const validateLoginFields = (req, res, next) => {
    const { usuario, password } = req.body;
  
    // Verificar si los campos 'usuario' y 'password' están presentes
    if (!usuario || !password) {
      return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
    }
  
    // Si todo está bien, continuar con el siguiente middleware (login)
    next();
  };
  
  module.exports = { validateLoginFields };
  