const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Aquí se guarda el ID del usuario automáticamente
        console.log("Usuario autenticado:", req.user);
        next();
    } catch (err) {
        res.status(400).json({ message: "Token inválido" });
    }
};

module.exports = { verifyToken };
