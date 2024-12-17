const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");

// Ejemplo de ruta protegida
router.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Ruta protegida accedida correctamente", user: req.user });
});

module.exports = router;
