const express = require("express");
const multer = require("multer");

const {
  getAsignacion,
  guardarAsignacion,
  editarAsignacion,
  eliminarAsignacion,
  cargarDocumentoActa,
  getDocumentoActa,
  generarActa, 
} = require("../controllers/asignacionController");

const router = express.Router();

// Configuración de multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ============ CRUD Asignaciones ============
router.get("/",getAsignacion);
router.post("/",guardarAsignacion);
router.put("/:id_asignacion",editarAsignacion);
router.delete("/:id_asignacion",eliminarAsignacion);

// ============ Archivos ============
// Flexible: acepta documento_acta, archivo o file
router.post("/:id_asignacion/documento", upload.any(), (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No se subió ningún archivo" });
  }
  req.file = req.files[0]; // Normalizamos para el controlador
  return cargarDocumentoActa(req, res, next);
});

router.get("/:id_asignacion/documento", getDocumentoActa);

// ============ Generar Acta dinámica ============
router.get("/:id_asignacion/acta", generarActa);


module.exports = router;
