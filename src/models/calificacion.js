const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig"); 

const EncuestaCalificacion = sequelize.define("EncuestaCalificacion", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre_cliente: {
        type: DataTypes.STRING,
        allowNull: false
    },
    area: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    asesor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pregunta1: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    pregunta2: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    pregunta3: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    pregunta4: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    pregunta5: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    pregunta6: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    pregunta7: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    pregunta8: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
    fechaCreacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "encuesta_calificacion",
    timestamps: false
});

module.exports = EncuestaCalificacion;