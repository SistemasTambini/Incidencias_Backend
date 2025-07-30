const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");  // Importa la instancia de Sequelize

const Area = sequelize.define("Area", {
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
    type: DataTypes.STRING(5),
    allowNull: false,
  }
},
  {
    freezeTableName: true, // Desactiva el plural
    timestamps: false,     // Desactiva los campos createdAt y updatedAt si no los usas
  });


module.exports = Area;
