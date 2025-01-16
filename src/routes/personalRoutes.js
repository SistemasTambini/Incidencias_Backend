const express = require("express");
const router = express.Router();

const {getPersonal,agregarPersonal,eliminarPersonal,getEmpresa, editarPersonal} = require("../controllers/personalController")

router.get("/",getPersonal)
router.post("/",agregarPersonal)
router.put("/:id",editarPersonal)
router.delete("/:id",eliminarPersonal)




module.exports = router;