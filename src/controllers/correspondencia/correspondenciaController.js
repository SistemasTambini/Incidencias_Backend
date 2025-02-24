const Correspondencia = require("../../models/correspondencia");
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
        "Asunto",
        "Para",
        "Recepcionado",
        "EntregadoPersona",
        "FechaEntrega",
        "imagen_url"
      ],
      where: { Estado: 1 },
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
    const { FechaRecepcion, Remitente, Asunto, Para, Recepcionado, EntregadoPersona } = req.body;
    let imagen_url = null;

    // Validar que los campos obligatorios estén presentes
    if (!FechaRecepcion || !Remitente || !Asunto || !Para || !Recepcionado) {
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
      Asunto,
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
    const { id, EntregadoPersona, FechaEntrega } = req.body;
    const correspondencia = await Correspondencia.findByPk(id);
    if (!correspondencia) {
      return res.status(404).json({ error: "Correspondencia no encontrada" });
    }
    correspondencia.EntregadoPersona = EntregadoPersona;
    correspondencia.FechaEntrega = FechaEntrega;
    await correspondencia.save();
    res.json({ message: "Entrega actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la entrega" });
  }
};

// PUT: Actualizar correspondencia
exports.updateCorrespondencia = async (req, res) => {
  try {
    const { id, Remitente, Asunto, Para, Recepcionado, EntregadoPersona } = req.body;

    // Buscar correspondencia por ID
    const correspondencia = await Correspondencia.findByPk(id);
    if (!correspondencia) {
      return res.status(404).json({ error: "Correspondencia no encontrada" });
    }

    // Actualizar solo los campos enviados en la petición
    if (Remitente) correspondencia.Remitente = Remitente;
    if (Asunto) correspondencia.Asunto = Asunto;
    if (Para) correspondencia.Para = Para;
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

    // Guardar los cambios en la base de datos
    await correspondencia.save();

    res.json({ message: "Correspondencia actualizada correctamente", correspondencia });
  } catch (error) {
    console.error("Error en updateCorrespondencia:", error);
    res.status(500).json({ error: "Error al actualizar la correspondencia", details: error.message });
  }
};
