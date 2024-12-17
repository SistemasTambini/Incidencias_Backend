const mysql = require("mysql");
require("dotenv").config(); // Asegúrate de cargar las variables de entorno

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});



module.exports = db; // Exportar la conexión para usarla en otros archivos
