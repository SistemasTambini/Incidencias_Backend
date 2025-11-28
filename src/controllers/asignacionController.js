// // /controllers/dashboardController.js

const { sequelize } = require("../config/dbConfig");
const { QueryTypes } = require("sequelize");
const Asignaciones = require("../models/asignaciones");
const Producto = require("../models/producto");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const path = require("path");
const fs = require("fs");

// ===================== GET LISTADO =====================
const getAsignacion = async (req, res) => {
  try {
    const result = await sequelize.query("CALL sp_ListadoAsignacion();", {
      type: QueryTypes.SELECT,
    });

    if (result && result.length > 0) {
      return res.status(200).json(result[0]);
    } else {
      return res.status(404).json({ message: "No se encontraron datos." });
    }
  } catch (error) {
    console.error("Error al ejecutar el procedimiento almacenado:", error);
    return res
      .status(500)
      .json({ message: "Error al ejecutar el procedimiento almacenado." });
  }
};

// ===================== CREAR =====================
const guardarAsignacion = async (req, res) => {
  const { id_usuario, id_producto, cantidad, Numero_Serie } = req.body;

  try {
    if (!id_usuario || !id_producto || !cantidad || !Numero_Serie) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const producto = await Producto.findOne({
      where: { ID_Producto: id_producto },
    });
    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" });

    const stockAsignado = producto.Stock_Asignado || 0;
    const disponible = producto.Cantidad - stockAsignado;

    if (cantidad > disponible) {
      return res.status(400).json({
        message: `Stock insuficiente. Solo se pueden asignar ${disponible} unidades.`,
      });
    }

    const nuevaAsignacion = await Asignaciones.create({
      id_usuario,
      id_producto,
      cantidad,
      Numero_Serie,
      estado: 1,
      estado_acta_subida: 0,
    });

    producto.Stock_Asignado = stockAsignado + cantidad;
    await producto.save();

    return res.status(201).json({
      message: "Asignación creada exitosamente",
      asignacion: nuevaAsignacion,
    });
  } catch (error) {
    console.error("Error al guardar la asignación:", error);
    return res.status(500).json({
      message: "Error al guardar la asignación",
      error: error.message,
    });
  }
};

// ===================== EDITAR =====================
const editarAsignacion = async (req, res) => {
  const { id_asignacion } = req.params;
  const { id_usuario, id_producto, cantidad } = req.body;

  try {
    const asignacion = await Asignaciones.findOne({ where: { id_asignacion } });
    if (!asignacion)
      return res.status(404).json({ message: "Asignación no encontrada" });

    const producto = await Producto.findOne({
      where: { ID_Producto: id_producto },
    });
    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" });

    const stockAsignado = producto.Stock_Asignado || 0;
    const diferencia = cantidad - asignacion.cantidad;
    const disponible = producto.Cantidad - stockAsignado;

    if (diferencia > 0 && disponible < diferencia) {
      return res.status(400).json({
        message: `Stock insuficiente. Solo se pueden asignar ${disponible} unidades adicionales.`,
      });
    }

    producto.Stock_Asignado = stockAsignado + diferencia;
    await producto.save();

    await asignacion.update({ id_usuario, id_producto, cantidad });

    return res.status(200).json({
      message: "Asignación actualizada exitosamente",
      asignacion,
    });
  } catch (error) {
    console.error("Error al editar la asignación:", error);
    return res.status(500).json({
      message: "Error al editar la asignación",
      error: error.message,
    });
  }
};

// ===================== ELIMINAR =====================
const eliminarAsignacion = async (req, res) => {
  const { id_asignacion } = req.params;

  try {
    const asignacion = await Asignaciones.findOne({ where: { id_asignacion } });
    if (!asignacion)
      return res.status(404).json({ message: "Asignación no encontrada" });

    const producto = await Producto.findOne({
      where: { ID_Producto: asignacion.id_producto },
    });
    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" });

    const cantidadAsignada = asignacion.cantidad || 0;
    const stockAsignadoActual = producto.Stock_Asignado || 0;

    producto.Stock_Asignado = Math.max(
      stockAsignadoActual - cantidadAsignada,
      0
    );
    await producto.save();

    await asignacion.update({ estado: 0 });

    return res.status(200).json({
      message: "Asignación eliminada exitosamente",
      asignacion,
    });
  } catch (error) {
    console.error("Error al eliminar la asignación:", error);
    return res.status(500).json({
      message: "Error al eliminar la asignación",
      error: error.message,
    });
  }
};

// ===================== CARGAR DOCUMENTO =====================
const cargarDocumentoActa = async (req, res) => {
  try {
    const { id_asignacion } = req.params;

    const asignacion = await Asignaciones.findOne({ where: { id_asignacion } });
    if (!asignacion)
      return res.status(404).json({ message: "Asignación no encontrada" });

    if (!req.file)
      return res
        .status(400)
        .json({ message: "No se ha subido ningún archivo" });

    await asignacion.update({
      documento_acta: req.file.buffer,
      tipo_documento: req.file.mimetype, // guardamos el tipo MIME
      estado_acta_subida: 1,
    });

    return res.status(200).json({
      message: "Documento de acta subido exitosamente",
      asignacion,
    });
  } catch (error) {
    console.error("Error al cargar el documento:", error);
    return res.status(500).json({
      message: "Error al cargar el documento",
      error: error.message,
    });
  }
};

// ===================== OBTENER DOCUMENTO =====================
const getDocumentoActa = async (req, res) => {
  try {
    const { id_asignacion } = req.params;

    const asignacion = await Asignaciones.findOne({ where: { id_asignacion } });
    if (!asignacion)
      return res.status(404).json({ message: "Asignación no encontrada" });

    if (!asignacion.documento_acta) {
      return res
        .status(404)
        .json({ message: "Documento de acta no encontrado" });
    }

    res.setHeader(
      "Content-Type",
      asignacion.tipo_documento || "application/octet-stream"
    );
    res.send(asignacion.documento_acta);
  } catch (error) {
    console.error("Error al recuperar el documento:", error);
    return res.status(500).json({
      message: "Error al recuperar el documento",
      error: error.message,
    });
  }
};

//genera el WORD CON LAS VARIABLES YA INSERTADAS 

const generarActa = async (req, res) => {
  try {
    const { id_asignacion } = req.params;
    // console.log("📥 ID recibido:", id_asignacion);

    const responsableNombre = req.user?.nombre + " " + req.user?.apellido;
    const responsableCargo = req.user?.area; // el área lo usamos como cargo
    const responsableDni = req.user?.documento;

    // 1. Ejecutar SP
    const [result] = await sequelize.query(
      `CALL sp_ListadoAsignacionPorId(:id_asignacion);`,
      {
        replacements: { id_asignacion },
        type: QueryTypes.SELECT,
      }
    );

    // console.log("📊 Resultado de SP:", result);

    // ✅ Extraer fila real
    const row = result["0"];
    if (!row) {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }

    // 2. Cargar plantilla
    const templatePath = path.resolve(
      __dirname,
      "../../plantillas/Acta_Entrega_Equipo_NotariaTambini.docx"
    );
    // console.log("📂 Plantilla cargada desde:", templatePath);

    const template = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(template);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: { start: "[[", end: "]]" },
    });

    const fechaHoy = new Date();

    const dataToFill = {
      fecha: fechaHoy.toLocaleDateString("es-PE"), 
      hora: fechaHoy.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      }),

      producto: row.NombreProducto,
      marca: row.marca,
      modelo: row.modelo,
      accesorios: row.Descripcion,
      estado_equipo: "Operativo y en buenas condiciones físicas",

      responsable_nombre: responsableNombre,
      responsable_cargo: responsableCargo,
      responsable_celular: "906538681",
      responsable_dni: responsableDni,

      usuario_nombre: row.nombre_completo,
      usuario_cargo: row.area,
      usuario_celular: row.telefono_usuario,
      usuario_dni: row.DNI_usuario,
    };

    // console.log("📝 Datos insertados en la plantilla:", dataToFill);


    doc.render(dataToFill);

    // 4. Generar archivo Word
    const buffer = doc.getZip().generate({ type: "nodebuffer" });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Acta_Entrega_${row.id_asignacion}.docx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.send(buffer);

    console.log(
      "✅ Acta generada correctamente. Tamaño:",
      buffer.length,
      "bytes"
    );
    console.log(
      "📤 Acta enviada al cliente:",
      `Acta_Entrega_${row.id_asignacion}.docx`
    );
  } catch (error) {
    console.error("❌ Error generando acta:", error);
    res.status(500).json({ message: "Error generando el acta" });
  }
};

module.exports = {
  getAsignacion,
  guardarAsignacion,
  editarAsignacion,
  eliminarAsignacion,
  cargarDocumentoActa,
  getDocumentoActa,
  generarActa,
};
