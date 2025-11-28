// Importar Sequelize y la instancia de conexión
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");
const Cargo = require("../models/cargo"); // Importa el modelo Cargo
const Area = require("../models/area"); 

// Definir el modelo de Usuario
const Usuario = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cargo: {
      type: DataTypes.INTEGER, // Relacionado con el ID del modelo Cargo
      references: {
        model: Cargo, // Nombre del modelo relacionado
        key: "id", // Llave primaria del modelo relacionado
      },
      allowNull: false,
    },
    documento: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    genero: {
      type: DataTypes.STRING(2), // Ejemplo: 'M' o 'F'
      allowNull: true,
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    id_area: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Area",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    Fecha_Creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    Fecha_Modificacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    Estado: {
      type: DataTypes.INTEGER,
      defaultValue: true, // 1: Activo, 0: Inactivo
    },
    Jefe: {
      type: DataTypes.INTEGER,
      defaultValue: true,
    },
    correo_coorporativo: {
      type: DataTypes.STRING,
      allowNull: true, // permite null
    },
    fecha_nacimiento: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
// Definir la asociación dentro del modelo
Usuario.belongsTo(Cargo, {
  foreignKey: "cargo", // Llave foránea en Usuario
  targetKey: "id", // Llave primaria en Cargo
});

Usuario.belongsTo(Area, {
  foreignKey: "id_area",
  targetKey: "id",
  as: "areaData", // alias para evitar conflictos
});

module.exports = Usuario;
