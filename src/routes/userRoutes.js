const express = require("express");
const { getAllUsuarios, getUserData, changePassword,updateUser } = require("../controllers/userController");

const router = express.Router();

// Ruta para obtener todos los usuarios (si la necesitas)
router.get("/", getAllUsuarios);

// Ruta para obtener los datos de un usuario específico (sin la contraseña)
router.get("/:usuario", getUserData); // El parámetro `usuario` será recibido en req.params

// Ruta para cambiar la contraseña de un usuario
router.post("/change-password", changePassword); // Se espera un body con usuario, passwordActual y nuevaPassword

router.put("/:usuario",updateUser );

module.exports = router;
