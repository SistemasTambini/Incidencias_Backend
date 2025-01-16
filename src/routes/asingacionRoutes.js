const express = require("express");
const {getAsignacion,guardarAsignacion,editarAsignacion,eliminarAsignacion} = require("../controllers/asignacionController");



const router = express.Router();

router.get("/",getAsignacion)
router.post("/",guardarAsignacion)
router.put("/:id_asignacion",editarAsignacion)
router.delete("/:id_asignacion",eliminarAsignacion)


module.exports = router;