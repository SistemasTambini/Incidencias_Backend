const RegistroLlamadas = require("../models/registroLlamadas");
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Usuario = require("../models/usuario");
// Crear nuevo registro
const crearRegistro = async (req, res) => {
  try {
    // 🔥 Formatear fechas si existen
    if (req.body.fecha_recordatorio) {
      req.body.fecha_recordatorio = req.body.fecha_recordatorio.replace('T', ' ').substring(0, 19);
    }

    if (req.body.fecha_respuesta) {
      req.body.fecha_respuesta = req.body.fecha_respuesta.replace('T', ' ').substring(0, 19);
    }

    // 📲 Buscar el usuario (asesor) por ID para obtener el teléfono
    const asesor = await Usuario.findByPk(req.body.id_asesor);

    if (!asesor) {
      return res.status(404).json({
        message: `No se encontró un usuario con ID ${req.body.id_asesor}`,
      });
    }

    // Si tiene teléfono, lo inyectamos al cuerpo del registro
    req.body.telefono = asesor.telefono || null;

    // 📝 Crear el registro de llamada
    const nuevoRegistro = await RegistroLlamadas.create(req.body);

    res.status(201).json({
      message: "Registro creado correctamente",
      data: nuevoRegistro,
    });
  } catch (error) {
    console.error("❌ Error al crear el registro:", error);
    res.status(500).json({ message: "Error al crear el registro", error });
  }
};

// Obtener todos los registros
const obtenerRegistros = async (req, res) => {
  try {
    // const registros = await RegistroLlamadas.findAll();
    const registros = await RegistroLlamadas.findAll({
      order: [["id", "DESC"]]
    });
    res.status(200).json(registros);
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    res.status(500).json({ message: "Error al obtener los registros", error });
  }
};


const obtenerRegistrosXusuario = async (req, res) => {
  try {
    const registros = await RegistroLlamadas.findAll({
      include: [
        {
          model: Usuario,
          as: 'asesor', 
          required: false, // LEFT JOIN
        }
      ],
      where: {
        id_asesor: 1 
      },
      order: [["id", "DESC"]]
    });

    res.status(200).json(registros);
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    res.status(500).json({ message: "Error al obtener los registros", error });
  }
};




const cambioEstado = async (req, res) => {
  try {
    const { id, estado } = req.body;

    if (!id || typeof estado === 'undefined') {
      return res.status(400).json({ message: "ID y estado son obligatorios." });
    }

    const registro = await RegistroLlamadas.findByPk(id);

    if (!registro) {
      return res.status(404).json({ message: "Registro no encontrado." });
    }

    registro.estado = estado;

    if (estado === 2) {
      // Si estado es 1 (Respondido) => guardamos fecha de respuesta
      const now = new Date();
      now.setHours(now.getHours() - 5); // 🔥 Corregimos 5 horas menos

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      registro.fecha_respuesta = formattedDate;
    } else if (estado === 3) {
      // Si estado es 2 (No respondido) => limpiamos fecha de respuesta
      registro.fecha_respuesta = null;
    }

    registro.Estado_envio_wp = 0;

    await registro.save();

    res.status(200).json({
      message: "Estado actualizado correctamente.",
      data: registro,
    });
  } catch (error) {
    console.error("Error al cambiar el estado:", error);
    res.status(500).json({ message: "Error al cambiar el estado", error });
  }
};

// POST: Actualizar Estado_envio_wp a 1, updatea el duplicado de estado bitacora a 0 y lo elimina 
 const updateEstadoEnvioWsp = async (req, res) => {
  try {
    const { id, Estado_envio_wp } = req.body;
    const registro = await RegistroLlamadas.findByPk(id);
    if (!registro) {
      return res.status(404).json({ error: "Correspondencia no encontrada" });
    }

    // Actualizar Estado_envio_wp a 1
    registro.Estado_envio_wp = 1;
    await registro.save();

    res.json({ message: "Estado envio wsp y Estado_Bitacora actualizados correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el Estado envio wsp y Estado_Bitacora", details: error.message });
  }
};

const obtenerPersonalxArea = async (req, res) => {
  try {
    const { id_area } = req.params;

    if (!id_area) {
      return res.status(400).json({ message: "El parámetro 'id_area' es requerido." });
    }

    const result = await sequelize.query('CALL sp_UsuarioxArea(:id_area)', {
      replacements: { id_area: parseInt(id_area) },
      type: QueryTypes.RAW,
    });

    if (result && result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No se encontraron datos." });
    }
  } catch (error) {
    console.error("Error al ejecutar el procedimiento almacenado:", error);
    return res.status(500).json({ message: "Error al ejecutar el procedimiento almacenado.", error });
  }
};

const UpdateRegistroLlamadas = async (req, res) => {
  try {
    const { id } = req.params; 
    const { area, asesor, tipo, contacto } = req.body;

    const registro_llamadas = await RegistroLlamadas.findByPk(id);
    if (!registro_llamadas) {
      return res.status(404).json({ error: "Registro de llamada no encontrado" });
    }

    registro_llamadas.area = area;
    registro_llamadas.asesor = asesor;
    registro_llamadas.tipo = tipo;
    registro_llamadas.contacto = contacto;

    await registro_llamadas.save();

    res.json({ message: "Registro de llamada actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar llamada:", error);
    res.status(500).json({ error: "Error al actualizar el registro de llamada" });
  }
};

const getReporteLLamadas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    if (!fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: "Debe proporcionar fecha_inicio y fecha_fin." });
    }

    const result = await sequelize.query(
      "CALL sp_reporteRegistroLLamadas(:fecha_inicio, :fecha_fin)",
      {
        replacements: {
          fecha_inicio,
          fecha_fin,
        },
        type: QueryTypes.RAW,
      }
    );

    if (result && result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No se encontraron registros en el rango de fechas." });
    }
  } catch (error) {
    console.error("Error al obtener el reporte de llamadas:", error);
    return res.status(500).json({
      message: "Error al ejecutar el procedimiento almacenado para el reporte.",
      error: error.message,
    });
  }
};


module.exports = {
  crearRegistro,
  obtenerRegistros,
  obtenerPersonalxArea,
  UpdateRegistroLlamadas,
  cambioEstado,
  updateEstadoEnvioWsp,
  getReporteLLamadas,
  obtenerRegistrosXusuario
};
