// // src/models/asesorModel.js
// import { DataTypes } from "sequelize";
// import sequelize from "../config/dbConfig"; 

// const Asesor = sequelize.define("Asesor", {
//   id_asesor: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   nombre_asesor: {
//     type: DataTypes.STRING,
//     get() {
//       return `${this.getDataValue('nombre')} ${this.getDataValue('apellido')}`;
//     }
//   },
//   correo_coorporativo: {
//     type: DataTypes.STRING,
//   },
//   telefono: {
//     type: DataTypes.STRING,
//   },
//   areaID: {
//     type: DataTypes.INTEGER,
//   },
//   nombre_area: {
//     type: DataTypes.STRING,
//   }
// }, {
//   tableName: "usuario", 
//   timestamps: false, 
// });

// export default Asesor;
// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/dbConfig"); 

// const Asesor = sequelize.define("Asesor", {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//   },
//   nombre: DataTypes.STRING,
//   apellido: DataTypes.STRING,
//   correo_coorporativo: DataTypes.STRING,
//   telefono: DataTypes.STRING,
//   id_area: DataTypes.INTEGER,
// }, {
//   tableName: "usuario",
//   timestamps: false,
// });

// module.exports = Asesor;
