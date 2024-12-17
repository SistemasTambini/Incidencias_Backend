// Middleware para verificar si el cuerpo de la solicitud tiene los campos necesarios
const validateLoginFields = (req, res, next) => {
    const { usuario, password } = req.body;
  
    // Verificar si los campos 'usuario' y 'password' están presentes
    if (!usuario || !password) {
      return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
    }
  
    // Si todo es válido, pasamos al siguiente middleware o controlador
    next();
  };
  
  module.exports = { validateLoginFields };
  