// Importar Sequelize y la instancia de conexión
const { DataTypes } = require('sequelize');
const sequelize = require("../config/dbConfig");

// Definir el modelo de Usuario
const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    genero: {
        type: DataTypes.STRING(2), // Ejemplo: 'M' o 'F'
        allowNull: true
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    telefono: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    id_area: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Area',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    Fecha_Creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    Fecha_Modificacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    Estado: {
        type: DataTypes.INTEGER,
        defaultValue: true // 1: Activo, 0: Inactivo
    }
}, {
    freezeTableName: true,
    timestamps: false,
  });

module.exports = Usuario;
