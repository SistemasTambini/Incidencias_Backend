const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Area = sequelize.define("Area", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
});

module.exports = Area;
