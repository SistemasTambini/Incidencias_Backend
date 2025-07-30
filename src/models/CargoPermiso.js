// models/CargoPermiso.js

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig"); 
const Cargo = require("../models/cargo");
const Permiso = require("./Permiso");


const CargoPermiso = sequelize.define('CargoPermiso', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cargo_id: { type: DataTypes.INTEGER, allowNull: false },
    permiso_id: { type: DataTypes.INTEGER, allowNull: false },
    estado: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    tableName: 'cargo_permisos',
    timestamps: false
});

CargoPermiso.belongsTo(Permiso, { foreignKey: 'permiso_id' });
CargoPermiso.belongsTo(Cargo, { foreignKey: 'cargo_id' });
Cargo.hasMany(CargoPermiso, { foreignKey: 'cargo_id' });
Permiso.hasMany(CargoPermiso, { foreignKey: 'permiso_id' });

module.exports = CargoPermiso;