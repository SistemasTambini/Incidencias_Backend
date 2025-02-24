const { DataTypes } = require('sequelize');
const sequelize = require("../config/dbConfig")
const Area = require('../models/area'); // Importa el modelo `Area`

const AgendaBot = sequelize.define('agendaBot', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    dni: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    telefono: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    area: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Area, // Hace referencia al modelo Area
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    fecha_registro: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    tipo: {
        type: DataTypes.STRING(45),
        allowNull: false,
        defaultValue: 0
    },
    constancia_pago: {
        type: DataTypes.STRING(45),
        allowNull: false,
        defaultValue: 0
    }

}, {
    tableName: 'agendaBot',
    timestamps: false
});

// Definir la relación directamente en este modelo
AgendaBot.belongsTo(Area, {
    foreignKey: 'area',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = AgendaBot;
