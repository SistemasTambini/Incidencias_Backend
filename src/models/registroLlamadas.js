const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig"); 

const RegistroLlamadas = sequelize.define("RegistroLlamadas", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha_recordatorio: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  usuario_seguimiento: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  area:{
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  id_asesor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  asesor: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },

  telefono: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  tipo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  contacto: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: "Teléfono o correo",
  },
  motivo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  estado: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: "1=Pendiente, 2=Respondido (ajústalo según tu lógica)",
  },
  fecha_respuesta: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  Estado_envio_wp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: "registro_llamadas",
  timestamps: false, // ya lo estás controlando manualmente
});

module.exports = RegistroLlamadas;
