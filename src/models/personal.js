const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig"); 
const Cargo = require("../models/cargo"); // Importa el modelo Cargo

const Personal = sequelize.define(
  "Personal",
  {
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
    documento: {
      type: DataTypes.STRING(8),
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
      type: DataTypes.INTEGER, // Relacionado con el ID del modelo Cargo
      references: {
        model: Cargo, // Nombre del modelo relacionado
        key: "id", // Llave primaria del modelo relacionado
      },
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// Definir la asociación dentro del modelo
Personal.belongsTo(Cargo, {
  foreignKey: "cargo", // Llave foránea en Personal
  targetKey: "id", // Llave primaria en Cargo
});

module.exports = Personal;
