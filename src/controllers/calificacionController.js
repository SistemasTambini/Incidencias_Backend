const sequelize = require('../config/dbConfig'); // Conexión a la base de datos
const { QueryTypes } = require('sequelize'); // Importamos QueryTypes de Sequelize para consultas SQL crudas


const EncuestaCalificacion = require("../models/calificacion");

const obtenerCalificaciones = async (req, res) => {
    try {
        const calificaciones = await EncuestaCalificacion.findAll();
        res.json(calificaciones);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las calificaciones" });
    }
};

const crearCalificacion = async (req, res) => {
    try {
        const { nombre_cliente, area, asesor, pregunta1, pregunta2, pregunta3, pregunta4, pregunta5, pregunta6, pregunta7,pregunta8 } = req.body;

        const nuevaCalificacion = await EncuestaCalificacion.create({
            nombre_cliente,
            area,
            asesor,
            pregunta1,
            pregunta2,
            pregunta3,
            pregunta4,
            pregunta5,
            pregunta6,
            pregunta7,
            pregunta8,
        });

        res.status(201).json(nuevaCalificacion);
    } catch (error) {
        res.status(500).json({ error: "Error al crear la calificación" });
    }
};

const obtenerUsuariosPorArea = async (req, res) => {
    try {
        const { area } = req.params; // Obtener el área desde los parámetros de la URL

        if (![1, 2].includes(Number(area))) {
            return res.status(400).json({ error: "Área no válida. Debe ser 1 o 2." });
        }

        const usuarios = await sequelize.query("CALL sp_mostrar_usuarioArea(:area)", {
            replacements: { area },
            type: QueryTypes.RAW, // Ejecuta una consulta sin devolver metadata extra
        });

        res.json(usuarios);
    } catch (error) {
        console.error("Error al obtener usuarios por área:", error);
        res.status(500).json({ error: "Error al obtener los usuarios" });
    }
};

const obtenerAreas = async (req, res) => {
    try {
        const areas = await sequelize.query("CALL mostrar_area()", {
            type: QueryTypes.RAW, // Ejecuta la consulta sin devolver metadata extra
        });

        res.json(areas);
    } catch (error) {
        console.error("Error al obtener las áreas:", error);
        res.status(500).json({ error: "Error al obtener las áreas" });
    }
};

module.exports = {
    obtenerCalificaciones,
    crearCalificacion,
    obtenerUsuariosPorArea,
    obtenerAreas
};
