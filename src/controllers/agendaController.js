const Area = require("../models/area");
const AgendaBot = require("../models/agenda");
const { getGMT5Date } = require('../utils/dateUtils');

// Crear una nueva cita test
const crearCita = async (req, res) => {
    const { nombre, apellido = "N/A", dni="N/A", telefono, estado, area=1, constancia_pago,fecha_registro } = req.body;

    // Validación básica
    // Validación de campos requeridos
    if (!nombre) {
        return res.status(400).json({ error: "El nombre es obligatorio." });
    }
    if (!telefono) {
        return res.status(400).json({ error: "El teléfono es obligatorio." });
    }
    if (!constancia_pago) {
        return res.status(400).json({ error: "La constancia de pago es obligatoria." });
    }

    try {
        

        // Convertir la fecha a GMT-5 si no se proporciona
        const fechaRegistroFinal = fecha_registro ? new Date(fecha_registro) : getGMT5Date();

        // Crear la cita con la fecha convertida
        const nuevaCita = await AgendaBot.create({
            nombre,
            apellido,
            dni,
            telefono,
            area,
            fecha_registro: fechaRegistroFinal,
            constancia_pago,
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
            tipo: "TESTAMENTO",
            constancia_pago,
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
            tipo: "LEGALIZACIONES",
            constancia_pago,
            // Si no se pasa un estado, usar 0 por defecto
        });

        res.status(201).json({
            message: "Recordatorio LEGALIZACIONES creado correctamente.",
            cita: nuevaCita,
        });
    } catch (error) {
        console.error("Error al guardar la cita:", error);
        res.status(500).json({ error: "Error al guardar la cita." });
    }
}

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
// Obtener todas las citas
// Obtener todas las citas de TOMA_DE_FIRMA con estado activo (1)
const obtenerCitasFirmas = async (req, res) => {
    try {
        const citas = await AgendaBot.findAll({
            where: {
                tipo: "TOMA_DE_FIRMA",
                estado: 1
            },
            attributes: ["id","nombre", "telefono", "fecha_registro"], // Solo traer los campos necesarios
            
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



module.exports = { crearCita, obtenerCitas,obtenerCitasFirmas, actualizarEstadoCita, RecordatorioAtu, RecordatorioExtraProcolar };



