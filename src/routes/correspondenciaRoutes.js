const express = require("express");
const router = express.Router();
const {getCorrespondencia,postRegistro,updateEntrega,updateCorrespondencia,updateFinalizado,getBitacoraRegistroCorrespondencia,getListarUsuarioJefe,updateEstadoEnvioWsp,getBitacoraPenultimoCorrespondencia} = require("../controllers/correspondencia/correspondenciaController")
const { uploadCorrespondencia } = require("../utils/uploadCorrespondencia");


// Rutas de correspondencia
router.get("/", getCorrespondencia);
router.post("/",uploadCorrespondencia ,postRegistro);
router.post("/uptEntrega", updateEntrega);
router.put("/uptCorre", uploadCorrespondencia,updateCorrespondencia);
router.post("/uptFinalizado", updateFinalizado);
router.get("/getBitacoraCorrespondencia", getBitacoraRegistroCorrespondencia);
router.get("/getListarUsuarioJefe", getListarUsuarioJefe);
router.post("/uptEstadoEnvioWsp", updateEstadoEnvioWsp);
router.post("/getBitacoraPenultimoCorrespondencia", getBitacoraPenultimoCorrespondencia);

module.exports = router;
