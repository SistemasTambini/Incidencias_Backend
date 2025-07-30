const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");  // Importa la instancia de Sequelize


const Correspondencia = sequelize.define("correspondencia", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  FechaRecepcion: {
    type: DataTypes.DATE,
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
  Recepcionado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  EntregadoPersona: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Observaciones: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  FechaEntrega: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  imagen_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  Estado_envio_wp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  
}, {
  tableName: "correspondencia",
  timestamps: false,
});



module.exports = Correspondencia;
