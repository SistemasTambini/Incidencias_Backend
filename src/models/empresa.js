const {DataTypes} = require('sequelize');
const sequelize = require("../config/dbConfig")

const Empresa = sequelize.define('Empresa',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    documento: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    telefono: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    empresacol: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    estado: {
        type: DataTypes.INTEGER,
        defaultValue: true // 1: Activo, 0: Inactivo
    },
    fecha_Creacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    fecha_Modificacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = Empresa;