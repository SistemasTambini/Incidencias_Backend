// models/producto.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig"); // Asegúrate de que la ruta sea correcta
const Categoria = require("./categoria"); // Relación con el modelo Categoria

const Producto = sequelize.define("Producto", {
  ID_Producto: {
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
    allowNull: false,
  },
  ID_Categoria: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Categoria,  // Relación con el modelo Categoria
      key: 'ID_Categoria'
    }
  },
  Marca: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Modelo: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  // Numero_Serie: {
  //   type: DataTypes.STRING(100),
  //   allowNull: false,
  // },
  Stock_Asignado: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  Cantidad: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  Tipo: {
  type: DataTypes.STRING(100),
   allowNull: false,
  },
    Valor_Activo: {
    type: DataTypes.STRING(100),
   allowNull: false,
  },
  QR_Code: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Estado: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // 1 = Activo, 0 = Inactivo
  },
  Url_image :{
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  Fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  Fecha_modificacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
{
  freezeTableName: true,  // Desactiva el plural
  timestamps: false,      // Desactiva los campos createdAt y updatedAt
});

// Definir la relación
Producto.belongsTo(Categoria, {
  foreignKey: 'ID_Categoria',  // Relación de la clave foránea
  targetKey: 'ID_Categoria',
});

module.exports = Producto;
