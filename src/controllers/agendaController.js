const Area = require("../models/area");
const AgendaBot = require("../models/agenda");
const { getGMT5Date } = require('../utils/dateUtils');

// Crear una nueva cita test
const crearCita = async (req, res) => {
    const { nombre, apellido, dni, telefono, estado, area, fecha_registro } = req.body;

    // Validación básica
    if (!nombre || !apellido || !dni || !telefono || !area || !fecha_registro) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        // Verificar si el área existe
        const areaExistente = await Area.findOne({ where: { id: area } });
        if (!areaExistente) {
            return res.status(404).json({ error: "El área especificada no existe." });
        }

        // Convertir la fecha a GMT-5 si no se proporciona
        const fechaRegistroFinal = fecha_registro ? new Date(fecha_registro) : getGMT5Date();

        // Crear la cita con la fecha convertida
        const nuevaCita = await AgendaBot.create({
            nombre,
            apellido,
            dni,
            telefono,
            area,
            estado: estado || 0, // Si no se pasa un estado, usar 0 por defecto
            fecha_registro: fechaRegistroFinal,
            tipo: 'TOMA_DE_FIRMA' // Usar la fecha convertida
        });

        res.status(201).json({
            message: "Cita creada correctamente.",
            cita: nuevaCita,
        });
    } catch (error) {
        console.error("Error al guardar la cita:", error);
        res.status(500).json({ error: "Error al guardar la cita." });
    }
};

const RecordatorioAtu = async (req, res) => {
    const { nombre, apellido = "N/A", dni, telefono, estado, area = 1 ,constancia_pago= "N/A"} = req.body;

    // Validación básica
    if (!nombre || !dni || !telefono) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        // Crear la cita con los datos recibidos
        const nuevaCita = await AgendaBot.create({
            nombre,
            apellido, // Usamos el apellido recibido o "N/A"
            dni,
            telefono,
            area, // Usamos el área recibida o 1 por defecto
            estado: estado || 0,
            tipo: "ATU",
            constancia_pago
            // Si no se pasa un estado, usar 0 por defecto
        });

        res.status(201).json({
            message: "Cita creada correctamente.",
            cita: nuevaCita,
        });
    } catch (error) {
        console.error("Error al guardar la cita:", error);
        res.status(500).json({ error: "Error al guardar la cita." });
    }
};

const RecordatorioExtraProcolar = async (req, res) => {
    const { nombre, apellido = "N/A", dni = "N/A", telefono, estado, area = 1, constancia_pago } = req.body;

    // Validación básica
    if (!nombre || !constancia_pago || !telefono) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        // Crear la cita con los datos recibidos
        const nuevaCita = await AgendaBot.create({
            nombre,
            apellido, // Usamos el apellido recibido o "N/A"
            dni,
            telefono,
            area, // Usamos el área recibida o 1 por defecto
            estado: 0,
            tipo: "EXTRAPROTOCOLAR",
            constancia_pago,
            // Si no se pasa un estado, usar 0 por defecto
        });

        res.status(201).json({
            message: "Recordatorio Extraprotocolar creado correctamente.",
            cita: nuevaCita,
        });
    } catch (error) {
        console.error("Error al guardar la cita:", error);
        res.status(500).json({ error: "Error al guardar la cita." });
    }
}


// Obtener todas las citas
const obtenerCitas = async (req, res) => {
    try {
        const citas = await AgendaBot.findAll({
            include: Area, // Incluir información del área asociada
        });

        res.status(200).json(citas);
    } catch (error) {
        console.error("Error al obtener las citas:", error);
        res.status(500).json({ error: "Error al obtener las citas." });
    }
};

// Actualizar el estado de una cita
const actualizarEstadoCita = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const cita = await AgendaBot.findByPk(id);

        if (!cita) {
            return res.status(404).json({ error: "Cita no encontrada." });
        }

        cita.estado = estado;
        await cita.save();

        res.status(200).json({ message: "Estado de la cita actualizado correctamente." });
    } catch (error) {
        console.error("Error al actualizar el estado de la cita:", error);
        res.status(500).json({ error: "Error al actualizar el estado de la cita." });
    }
};



module.exports = { crearCita, obtenerCitas, actualizarEstadoCita, RecordatorioAtu, RecordatorioExtraProcolar };



