const multer = require("multer");

// Almacenamiento en memoria (para procesar Excel directamente)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
