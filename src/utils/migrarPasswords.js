const bcrypt = require("bcrypt");
//const { sequelize } = require("../config/dbConfig");
const Personal = require("../models/personal");

(async () => {
  try {
    const usuarios = await Personal.findAll();
    for (const user of usuarios) {
      // Si la contraseña no está encriptada (longitud menor a 50 por ejemplo)
      if (user.password.length < 50) {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
        await user.save();
        console.log(`✅ Usuario ${user.usuario} actualizado`);
      }
    }
    console.log("🚀 Migración completada");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();