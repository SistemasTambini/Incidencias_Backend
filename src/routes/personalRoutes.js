const express = require("express");
const router = express.Router();

const {getPersonal,agregarPersonal,eliminarPersonal,getEmpresa, editarPersonal,getUserData} = require("../controllers/personalController")

router.get("/",getPersonal)
router.post("/",agregarPersonal)
router.put("/:id",editarPersonal)
router.delete("/:id",eliminarPersonal)

// router.get("/:usuario", getUserData);
// routes/personalRoutes.js
router.get("/:usuario", getUserData); // ahora acepta id numérico o username



module.exports = router;