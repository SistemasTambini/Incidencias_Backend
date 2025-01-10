const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Rutas base para guardar imágenes
const productPath = path.join(process.cwd(), "public", "assets", "productos");
const qrPath = path.join(process.cwd(), "public", "assets", "QR");

// Asegúrate de que las carpetas de destino existan
const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configuración para subir imágenes de productos
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Saving product image to path:", productPath); // Log para verificar la ruta de guardado
    ensureDirectoryExistence(productPath); // Crear la carpeta si no existe
    cb(null, productPath); // Usar la ruta absoluta para imágenes de productos
  },
  filename: (req, file, cb) => {
    const uniqueName = `product-${Date.now()}-${file.originalname}`; // Corrección: Uso de backticks
    cb(null, uniqueName); // Generar un nombre único para el archivo
  },
});

// Configuración para subir códigos QR
const qrStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Saving QR code to path:", qrPath); // Log para verificar la ruta de guardado
    ensureDirectoryExistence(qrPath); // Crear la carpeta si no existe
    cb(null, qrPath); // Usar la ruta absoluta para los códigos QR
  },
  filename: (req, file, cb) => {
    const uniqueName = `QR-${Date.now()}-${file.originalname}`; // Corrección: Uso de backticks
    cb(null, uniqueName); // Generar un nombre único para el archivo
  },
});

// Middlewares para subir archivos
const uploadProductImage = multer({ storage: productStorage }).single("image");
const uploadQRCode = multer({ storage: qrStorage }).single("qr");

module.exports = { uploadProductImage, uploadQRCode };
