// models/etiquetaQR.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig"); // Asegúrate de que la ruta sea correcta
const Producto = require("./producto"); // Relación con el modelo Producto

const EtiquetaQR = sequelize.define("EtiquetaQR", {
  ID_QR: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Codigo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  URL_Info_Equipo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  Fecha_Generacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ID_Producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,  // Relación con el modelo Producto
      key: 'ID_Producto'
    }
  }
},
{
  freezeTableName: true,  // Desactiva el plural
  timestamps: false,      // Desactiva los campos createdAt y updatedAt
});

// Definir la relación
EtiquetaQR.belongsTo(Producto, {
  foreignKey: 'ID_Producto',  // Relación de la clave foránea
  targetKey: 'ID_Producto',
});

module.exports = EtiquetaQR;
