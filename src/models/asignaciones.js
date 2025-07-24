// Importar Sequelize y la instancia de la conexión
const { DataTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");
const Usuario = require("../models/usuario")
const Producto = require("../models/producto")

// Definir el modelo de Asignaciones
const Asignaciones = sequelize.define('Asignaciones', {
    id_asignacion: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    id_producto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Producto,
            key: 'ID_Producto'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    cantidad: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    Numero_Serie: {
    type: DataTypes.STRING(100),
    allowNull: false,
    },
    fecha_asignacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
}, {
    freezeTableName: true,
    timestamps: false,
  });

module.exports = Asignaciones;
