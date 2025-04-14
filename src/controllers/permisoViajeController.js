const PermisoViaje = require('../models/PermisoViaje');
const path = require("path");

exports.create = async (req, res) => {
  try {
    console.log("📦 req.body:", req.body);
    console.log("🖼️ req.files:", req.files);

    // Limpiar posibles errores en las claves del body (como tabs)
    const cleanBody = {};
    for (const key in req.body) {
      cleanBody[key.trim()] = req.body[key];
    }

    console.log("📥 Clean body recibido:", JSON.stringify(cleanBody, null, 2));

    // Desestructurar campos del body ya limpio
    const {
      codigo = '',
      fechaRegistro = '',
      Padre = '',
      DniPadre = '',
      Madre = '',
      DniMadre = '',
      Hijos = '[]'
    } = cleanBody;

    // Validación básica
    if (
      !codigo?.trim() ||
      !fechaRegistro ||
      !Padre?.trim() ||
      !DniPadre?.trim() ||
      !Madre?.trim() ||
      !DniMadre?.trim()
    ) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }


    // Parsear Hijos si viene como string
    let hijosParsed = [];
    try {
      hijosParsed = JSON.parse(Hijos);
    } catch (err) {
      return res.status(400).json({ error: 'El campo Hijos debe ser un JSON válido' });
    }

    // Procesar archivos subidos
    let archivosRutas = [];
    if (req.files && req.files.length > 0) {
      archivosRutas = req.files.map(file => {
        const relativePath = path.relative(path.join(process.cwd(), 'public'), file.path);
        return relativePath.replace(/\\/g, "/");
      });
    }

    const nuevoPermiso = await PermisoViaje.create({
      codigo,
      fechaRegistro,
      Padre,
      DniPadre,
      Madre,
      DniMadre,
      Hijos: hijosParsed,
      Archivos: archivosRutas.join(","), // texto con rutas separadas por coma
    });

    res.status(201).json(nuevoPermiso);
  } catch (error) {
    console.error("❌ Error al crear permiso de viaje:", error);
    res.status(500).json({ error: 'Hubo un error al crear el permiso de viaje' });
  }
};


// Función para obtener todos los PermisosViaje
exports.getAll = async (req, res) => {
  try {
    const permisos = await PermisoViaje.findAll();
    res.status(200).json(permisos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al obtener los permisos de viaje' });
  }
};

// Función de actualización
exports.update = async (req, res) => {
  try {
    const { codigo } = req.params; // El código es el parámetro para identificar el permiso a editar
    console.log("📦 req.body:", req.body);

    // Limpiar posibles errores en las claves del body (como tabs)
    const cleanBody = {};
    for (const key in req.body) {
      cleanBody[key.trim()] = req.body[key];
    }

    console.log("📥 Clean body recibido:", JSON.stringify(cleanBody, null, 2));

    // Desestructurar campos del body ya limpio
    const {
      Padre = '',
      DniPadre = '',
      Madre = '',
      DniMadre = '',
      Hijos = '[]'
    } = cleanBody;

    // Validación básica
    if (
      !Padre?.trim() ||
      !DniPadre?.trim() ||
      !Madre?.trim() ||
      !DniMadre?.trim()
    ) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Parsear Hijos si viene como string
    let hijosParsed = [];
    try {
      hijosParsed = JSON.parse(Hijos);
    } catch (err) {
      return res.status(400).json({ error: 'El campo Hijos debe ser un JSON válido' });
    }

    // Buscar el permiso de viaje por el código
    const permiso = await PermisoViaje.findOne({ where: { codigo } });

    if (!permiso) {
      return res.status(404).json({ error: 'Permiso de viaje no encontrado' });
    }

    // Actualizar los campos
    permiso.Padre = Padre;
    permiso.DniPadre = DniPadre;
    permiso.Madre = Madre;
    permiso.DniMadre = DniMadre;
    permiso.Hijos = hijosParsed;

    // Guardar los cambios en la base de datos
    await permiso.save();

    // Responder con el permiso actualizado
    res.status(200).json(permiso);
  } catch (error) {
    console.error("❌ Error al actualizar permiso de viaje:", error);
    res.status(500).json({ error: 'Hubo un error al actualizar el permiso de viaje' });
  }
};