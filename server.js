// server.js
require("dotenv").config();
const { sequelize, sequelize2 } = require("./src/config/dbConfig");
const app = require("./src/app");

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a la BD principal");
    await sequelize2.authenticate();
    console.log("✅ Conectado a la BD secundaria");

    app.listen(PORT, HOST, () => {
      console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al conectar con la BD:", error.message);
    process.exit(1);
  }
})();
