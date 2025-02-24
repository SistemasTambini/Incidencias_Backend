const { Sequelize } = require("sequelize");
require("dotenv").config(); // Cargar las variables de entorno

// Conexión a la base de datos principal
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    logging: false,
  }
);

// Conexión a la segunda base de datos
const sequelize2 = new Sequelize(
  process.env.DB_NAME2,
  process.env.DB_USER2,
  process.env.DB_PASSWORD2,
  {
    host: process.env.DB_HOST2,
    dialect: "mysql",
    port: parseInt(process.env.DB_PORT2, 10) || 3306,
    logging: false,
  }
);

// Verificar conexiones (opcional para depuración)
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos principal exitosa.");
  } catch (error) {
    console.error("Error al conectar con la base de datos principal:", error.message);
  }

  try {
    await sequelize2.authenticate();
    console.log("Conexión a la segunda base de datos exitosa.");
  } catch (error) {
    console.error("Error al conectar con la segunda base de datos:", error.message);
  }
})();

// Exportar `sequelize` como exportación predeterminada y `sequelize2` como adicional
module.exports = sequelize;
module.exports.sequelize2 = sequelize2;
