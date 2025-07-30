const { DataTypes } = require('sequelize');
const { sequelize } = require("../config/dbConfig");  // Aquí debes poner la configuración de tu conexión a la base de datos

const PermisoViaje = sequelize.define('PermisoViaje', {
  codigo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fechaRegistro: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Padre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  DniPadre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Madre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  DniMadre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Hijos: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  Archivos: {
    type: DataTypes.TEXT,
    defaultValue: ""
  }
}, {
  tableName: 'permiso_viaje',
  timestamps: false // Si no usas campos 'createdAt' o 'updatedAt'
});

module.exports = PermisoViaje;