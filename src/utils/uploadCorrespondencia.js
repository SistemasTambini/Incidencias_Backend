const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ruta base para guardar archivos de correspondencia
const correspondenciaPath = path.join(process.cwd(), "public", "assets", "correspondencia");

// Asegurar que la carpeta de destino exista
const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configuración para subir archivos de correspondencia (imágenes/PDF)
const correspondenciaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Saving correspondencia file to path:", correspondenciaPath); // Log para verificar la ruta de guardado
    ensureDirectoryExistence(correspondenciaPath); // Crear la carpeta si no existe
    cb(null, correspondenciaPath); // Usar la ruta absoluta
  },
  filename: (req, file, cb) => {
    const uniqueName = `Correspondencia-${Date.now()}${path.extname(file.originalname)}`; // Nombre único
    cb(null, uniqueName);
  },
});

// Middleware para subir archivos
const uploadCorrespondencia = multer({ 
  storage: correspondenciaStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
}).single("archivo"); // Nombre del campo en el formulario

module.exports = { uploadCorrespondencia };
