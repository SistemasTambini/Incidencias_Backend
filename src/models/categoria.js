const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");  // Importa la instancia de Sequelize

const Categoria = sequelize.define("Categoria", {
  ID_Categoria: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,  // Establece el estado por defecto como 1 (activo)
  },
},
{
  freezeTableName: true, // Desactiva el plural
  timestamps: false,     // Desactiva los campos createdAt y updatedAt si no los usas
});

module.exports = Categoria;
