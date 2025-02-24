const Personal = require("../models/personal");
const Cargo = require("../models/cargo");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
  }

  try {
    // Buscar el usuario en la base de datos incluyendo el cargo
    const user = await Personal.findOne({
      where: { usuario, estado: 1 },
      include: [{ model: Cargo, attributes: ["nombre"] }] // Relación con Cargo
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Comparar contraseñas directamente (⚠️ Se recomienda encriptarlas con bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Obtener el nombre del cargo si existe
    const cargoNombre = user.Cargo ? user.Cargo.nombre : "Sin cargo";

    // Generar el token JWT, incluyendo nombre del cargo
    const token = jwt.sign(
      { 
        id: user.id, 
        usuario: user.usuario, 
        nombre: user.nombre,
        apellido: user.apellido,
        cargo: cargoNombre // Ahora devuelve el nombre del cargo en el token
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Responder con el token y datos del usuario
    res.status(200).json({ 
      message: "Login exitoso", 
      token, 
      id: user.id, 
      nombre: user.nombre, 
      apellido: user.apellido, 
      usuario: user.usuario,
      cargo: cargoNombre // Enviar el cargo en la respuesta
    });

  } catch (err) {
    res.status(500).json({ message: "Error al iniciar sesión", error: err.message });
  }
};

module.exports = { login };
