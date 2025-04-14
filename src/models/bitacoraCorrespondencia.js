const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig"); 


const BitacoraCorrespondencia = sequelize.define("bitacora_correspondencia", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  correspondencia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Remitente: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Para: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  EntregadoPersona: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Observaciones: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Estado_Bitacora: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Fecha_Modificada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  
}, {
  tableName: "bitacora_correspondencia",
  timestamps: false,
});

module.exports = BitacoraCorrespondencia;
