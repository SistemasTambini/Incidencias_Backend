const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Base folder
const basePath = path.join(process.cwd(), "public", "assets", "permiso_viaje");

const ensureDirectoryExistence = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const codigo = req.body.codigo;
    const targetPath = path.join(basePath, codigo);

    ensureDirectoryExistence(targetPath);
    cb(null, targetPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const uploadPermiso_viaje = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).array("archivos", 10); // Hasta 10 archivos

module.exports = { uploadPermiso_viaje };
