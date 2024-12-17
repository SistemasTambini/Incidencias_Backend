const { Sequelize } = require("sequelize");
require("dotenv").config(); // Cargar las variables de entorno

// Inicializar Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,   // Nombre de la base de datos
  process.env.DB_USER,   // Usuario de la base de datos
  process.env.DB_PASSWORD, // Contraseña de la base de datos
  {
    host: process.env.DB_HOST,
    dialect: "mysql",    // Dialecto a usar (MySQL en este caso)
    port: process.env.DB_PORT || 3306, // Puerto de la base de datos
    logging: false,      // Desactivar logs de SQL en la consola
  }
);

// Verificar la conexión con la base de datos
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos exitosa.");
  } catch (err) {
    console.error("Error al conectar con la base de datos:", err.message);
  }
})();

module.exports = sequelize;
