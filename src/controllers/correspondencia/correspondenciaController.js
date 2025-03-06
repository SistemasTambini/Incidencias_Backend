const { Op } = require("sequelize");
const Correspondencia = require("../../models/correspondencia");
const BitacoraCorrespondencia = require("../../models/bitacoraCorrespondencia");
const listadoUsuarioJefe = require("../../models/usuario");
const path = require("path");
const fs = require("fs");

// GET: Obtener registros con estado 1
exports.getCorrespondencia = async (req, res) => {
  try {
    const correspondencias = await Correspondencia.findAll({
      attributes: [
        "id",
        "FechaRecepcion",
        "Remitente",
        "Observaciones",
        "Para",
        "Recepcionado",
        "EntregadoPersona",
        "FechaEntrega",
        "imagen_url",
        "Estado"
      ],
      where: {
        Estado: {
          [Op.ne]: 0 // Excluye registros donde Estado sea 0
        }
      },
      order: [["id", "DESC"]],
    });
    res.json(correspondencias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener correspondencias" });
  }
};

// POST: Registrar nueva correspondencia
exports.postRegistro = async (req, res) => {
  try {
    const { FechaRecepcion, Remitente, Observaciones, Para, Recepcionado, EntregadoPersona } = req.body;
    let imagen_url = null;

    // Validar que los campos obligatorios estén presentes
    if (!FechaRecepcion || !Remitente  || !Para || !Recepcionado) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Procesar la imagen o PDF si está presente
    if (req.file) {
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `Correspondencia-${Date.now()}${fileExtension}`;
      const targetPath = path.join(process.cwd(), "public", "assets", "correspondencia", fileName);

      try {
        // Mover el archivo a la ubicación final
        fs.renameSync(req.file.path, targetPath);
        imagen_url = `http://192.168.1.200:3000/assets/correspondencia/${fileName}`;
      } catch (fsError) {
        return res.status(500).json({
          error: "Error al guardar el archivo",
          details: fsError.message,
        });
      }
    }

    // Guardar la correspondencia en la base de datos
    const nuevaCorrespondencia = await Correspondencia.create({
      FechaRecepcion,
      Remitente,
      Observaciones,
      Para,
      Recepcionado,
      EntregadoPersona: EntregadoPersona || "", // Enviar cadena vacía si no se proporciona
      Estado: 1, // Estado activo por defecto
      imagen_url, // Guardar la URL si hay archivo, sino null
    });

    res.status(201).json(nuevaCorrespondencia);
  } catch (error) {
    console.error("Error en postRegistro:", error);
    res.status(500).json({ error: "Error al registrar correspondencia", details: error.message });
  }
};


// POST: Actualizar entrega
exports.updateEntrega = async (req, res) => {
  try {
    const { id, EntregadoPersona, FechaEntrega} = req.body;
    const correspondencia = await Correspondencia.findByPk(id);
    if (!correspondencia) {
      return res.status(404).json({ error: "Correspondencia no encontrada" });
    }
    correspondencia.EntregadoPersona = EntregadoPersona;
    correspondencia.FechaEntrega = FechaEntrega;
    correspondencia.Estado = 2;
    await correspondencia.save();
    res.json({ message: "Entrega actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la entrega" });
  }
};


// PUT: Actualizar correspondencia
exports.updateCorrespondencia = async (req, res) => {
  try {
    const { id, Remitente, Observaciones, Para, Recepcionado, EntregadoPersona } = req.body;

    // Buscar correspondencia por ID
    const correspondencia = await Correspondencia.findByPk(id);
    if (!correspondencia) {
      return res.status(404).json({ error: "Correspondencia no encontrada" });
    }

    let estadoActualizado = false;

    // Actualizar solo los campos enviados en la petición
    if (Remitente) correspondencia.Remitente = Remitente;
    if (Observaciones) correspondencia.Observaciones = Observaciones;
    if (Para && correspondencia.Para !== Para) {
      correspondencia.Para = Para;
      correspondencia.Estado = 3; // Solo actualizar estado si "Para" cambió
      estadoActualizado = true;
    }
    if (Recepcionado) correspondencia.Recepcionado = Recepcionado;
    if (EntregadoPersona) correspondencia.EntregadoPersona = EntregadoPersona;

    // Manejo de actualización de imagen (si se envía una nueva)
    if (req.file) {
      // Eliminar la imagen anterior si existía
      if (correspondencia.imagen_url) {
        const oldImagePath = path.join(process.cwd(), "public", correspondencia.imagen_url.split("/assets/")[1]);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Guardar la nueva imagen
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `Correspondencia-${Date.now()}${fileExtension}`;
      const targetPath = path.join(process.cwd(), "public", "assets", "correspondencia", fileName);

      try {
        fs.renameSync(req.file.path, targetPath);
        correspondencia.imagen_url = `http://192.168.1.200:3000/assets/correspondencia/${fileName}`;
      } catch (fsError) {
        return res.status(500).json({
          error: "Error al guardar el archivo",
          details: fsError.message,
        });
      }
    }

    // Guardar los cambios en la base de datos solo si hubo cambios
    if (Remitente || Observaciones || Para || Recepcionado || EntregadoPersona || req.file || estadoActualizado) {
      await correspondencia.save();
    }

    res.json({ message: "Correspondencia actualizada correctamente", correspondencia });
  } catch (error) {
    console.error("Error en updateCorrespondencia:", error);
    res.status(500).json({ error: "Error al actualizar la correspondencia", details: error.message });
  }
};



// POST: Actualizar Finalizado
exports.updateFinalizado = async (req, res) => {
  try {
    const { id} = req.body;
    const correspondencia = await Correspondencia.findByPk(id);
    if (!correspondencia) {
      return res.status(404).json({ error: "Correspondencia no encontrada" });
    }
    correspondencia.Estado = 4;
    await correspondencia.save();
    res.json({ message: "Entrega Finalizada Correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la entrega" });
  }
};


// GET: Obtener bitácora por correspondencia_id
exports.getBitacoraRegistroCorrespondencia = async (req, res) => {
  try {
    const { correspondencia_id } = req.query; // Obtener el ID de la consulta

    if (!correspondencia_id) {
      return res.status(400).json({ error: "El parámetro correspondencia_id es requerido" });
    }

    const bitacora_correspondencia = await BitacoraCorrespondencia.findAll({
      attributes: [
        "id",
        "Remitente",
        "Para",
        "EntregadoPersona",
        "Observaciones",
        "Estado",
        "Fecha_Modificada",
    
      ],
      where: { correspondencia_id },
    });

    res.json(bitacora_correspondencia);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener bitacora_correspondencia", details: error.message });
  }
};

// GET: Obtener usuario estado 1 y cargo jefe 1
exports.getListarUsuarioJefe = async (req, res) => {
  try {
    const usuarios = await listadoUsuarioJefe.findAll({
      attributes: ["id", "nombre", "apellido", "documento", "telefono"],
      where: {
        Estado: 1,
        Jefe: 1,
      },
    });

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuario", details: error.message });
  }
};








