const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Obtener el token de los encabezados de la solicitud
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar la información del usuario decodificada al objeto 'req'
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token inválido" });
  }
};

module.exports = { verifyToken };
