const { sequelize } = require("../config/dbConfig");

const getListarUsuarioRecordatorio = async (req, res) => {
  const { tipo_recorda } = req.query;

  if (!tipo_recorda) {
    return res.status(400).json({ message: 'Por favor, proporciona el tipo de recordatorio' });
  }

  try {
    // Llamada al procedimiento almacenado `sp_listar_ultimo_recordatorio`
    const listado_recordatorio = await sequelize.query(
      'CALL sp_listar_ultimo_recordatorio(:tipo_recorda)', 
      {
        replacements: { tipo_recorda },
        type: sequelize.QueryTypes.RAW, // Se usa RAW en lugar de SELECT
      }
    );

    // Verificar si se obtuvieron resultados
    if (!listado_recordatorio || listado_recordatorio.length === 0) {
      return res.status(404).json({ message: 'No se encontraron datos para el tipo proporcionado.' });
    }

    return res.status(200).json(listado_recordatorio);
  } catch (error) {
    console.error('Error al obtener el listado de usuario recordatorio:', error);
    return res.status(500).json({ message: 'Error interno del servidor al obtener el listado de usuario recordatorio.' });
  }
};

const getLitadoCliente = async (req, res) => {
    const { u_nombre_completo } = req.query;

    if (!u_nombre_completo) {
        return res.status(400).json({ message: 'Por favor, proporciona el nombre del cliente' });
    }

    try {
        // Llamada al procedimiento almacenado
        const listado_cliente = await sequelize.query(
            'CALL sp_listar_cliente_siganot(:u_nombre_completo)',
            {
                replacements: { u_nombre_completo },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        console.log("Respuesta completa de la BD:", listado_cliente);

        // Si no hay resultados
        if (!listado_cliente || listado_cliente.length === 0) {
            return res.status(404).json({ message: 'No se encontraron datos para el nombre proporcionado.' });
        }

        // Extraer solo los valores del objeto de clientes (ignorar metadatos)
        const clientes = Object.values(listado_cliente[0]).filter(cliente => typeof cliente === "object");

        console.log("Clientes procesados:", clientes);

        return res.status(200).json(clientes);
    } catch (error) {
        console.error('Error al obtener el listado de clientes:', error);
        return res.status(500).json({ message: 'Error interno del servidor al obtener el listado de clientes.' });
    }
};


module.exports = { getListarUsuarioRecordatorio, getLitadoCliente };
