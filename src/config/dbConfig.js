// src/config/dbConfig.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

const sequelize2 = new Sequelize(
  process.env.DB_NAME2,
  process.env.DB_USER2,
  process.env.DB_PASSWORD2,
  {
    host: process.env.DB_HOST2,
    dialect: "mysql",
    port: process.env.DB_PORT2 || 3306,
    logging: false,
  }
);

module.exports = { sequelize, sequelize2 };
