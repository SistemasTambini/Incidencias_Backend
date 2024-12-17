const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig"); // Importa la conexión configurada

const Personal = sequelize.define("Personal", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  cargo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

module.exports = Personal;
