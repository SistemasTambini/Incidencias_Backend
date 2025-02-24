const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Permiso = sequelize.define('permisos', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING, allowNull: false }
}, {
    freezeTableName: true, // Desactiva el plural
    timestamps: false,     // Desactiva los campos createdAt y updatedAt si no los usas
});


module.exports = Permiso;