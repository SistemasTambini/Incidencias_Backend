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
  estado: {
    type: DataTypes.STRING(5),
    allowNull: false,
  },
},
{
  freezeTableName: true, // Desactiva el plural
  timestamps: false,     // Desactiva los campos createdAt y updatedAt si no los usas
});

module.exports = Personal;
