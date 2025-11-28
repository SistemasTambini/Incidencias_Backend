// utils/generarQR.js
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

async function generarQRArchivo({ data, nombreArchivo, carpetaRelativa = ['public','assets','QR'] }) {
  if (!data || !String(data).trim()) {
    throw new Error('data requerida para generar el QR');
  }

  const dirAbs = path.join(process.cwd(), ...carpetaRelativa);
  if (!fs.existsSync(dirAbs)) fs.mkdirSync(dirAbs, { recursive: true });

  const rutaAbs = path.join(dirAbs, nombreArchivo);

  await QRCode.toFile(rutaAbs, String(data), {
    type: 'png',
    errorCorrectionLevel: 'M',
    margin: 1,
    scale: 8,
  });

  return rutaAbs; // ruta absoluta del archivo generado
}

module.exports = { generarQRArchivo };
