// utils/dateUtils.js

// Función para obtener la fecha en GMT-5
const getGMT5Date = () => {
    const now = new Date();
    const offset = 5 * 60 * 60 * 1000; // 5 horas en milisegundos
    const fechaGMT5 = new Date(now.getTime() - offset);
  
    // Formatear la fecha como YYYY-MM-DD HH:mm:ss
    const year = fechaGMT5.getFullYear();
    const month = String(fechaGMT5.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
    const day = String(fechaGMT5.getDate()).padStart(2, '0');
    const hours = String(fechaGMT5.getHours()).padStart(2, '0');
    const minutes = String(fechaGMT5.getMinutes()).padStart(2, '0');
    const seconds = String(fechaGMT5.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  
  module.exports = {
    getGMT5Date,
  };
  