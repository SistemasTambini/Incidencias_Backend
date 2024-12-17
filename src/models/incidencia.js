const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Incidencia = sequelize.define("Incidencia", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  problema: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  atencion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  area: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  prioridad: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  observacion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Incidencia;
