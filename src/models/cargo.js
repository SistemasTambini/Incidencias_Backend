const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig"); 


const Cargo = sequelize.define("Cargo", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
    {
      freezeTableName: true, // Desactiva el plural
      timestamps: false,     // Desactiva los campos createdAt y updatedAt si no los usas
    });
  
  
  module.exports = Cargo;