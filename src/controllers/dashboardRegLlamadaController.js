
const { sequelize } = require("../config/dbConfig"); 
const { QueryTypes } = require('sequelize'); 

//combo x area


const getRegistroxUsuario = async (req, res) => {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
  
      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({ message: 'Faltan parámetros requeridos.' });
      }

      const result = await sequelize.query(
        'CALL sp_dashboard_tiempo_espera_diario(:fecha_inicio, :fecha_fin)',
        {
          replacements: { fecha_inicio, fecha_fin },
          type: QueryTypes.RAW 
        }
      );
  
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      return res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado.' });
    }
};


const getRegLlamadaxAreaEstado = async (req, res) => {
    try {
        // const { area } = req.params;
        const { estado_param } = req.query;

        if (!estado_param) {
            return res.status(400).json({ error: "El parámetro 'estado_param' es requerido." });
        }

        const registroLlamada = await sequelize.query(
            "CALL sp_dashboard_reg_llamadas_circle(:estado_param)",
            {
                replacements: {
                    // area_param: area,
                    estado_param: parseInt(estado_param)
                },
                type: QueryTypes.RAW,
            }
        );

        res.json(registroLlamada);
    } catch (error) {
        console.error("Error al obtener registro de llamada por área o por estado", error);
        res.status(500).json({ error: "Error al obtener los registros de llamadas" });
    }
};

const getRegistroPorcentajexArea= async (req, res) => {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
  
      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({ message: 'Faltan parámetros requeridos.' });
      }

      const result = await sequelize.query(
        'CALL sp_dashboard_reg_pend_porcentaje(:fecha_inicio, :fecha_fin)',
        {
          replacements: { fecha_inicio, fecha_fin },
          type: QueryTypes.RAW 
        }
      );
  
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      return res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado.' });
    }
};


const getRegLlamadaxTipoxAsesor= async (req, res) => {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
  
      if (!fecha_inicio || !fecha_fin) {
        return res.status(400).json({ message: 'Faltan parámetros requeridos.' });
      }

      const result = await sequelize.query(
        'CALL sp_dashboard_reg_llama_tipo_por_asesor(:fecha_inicio, :fecha_fin)',
        {
          replacements: { fecha_inicio, fecha_fin },
          type: QueryTypes.RAW 
        }
      );
  
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      return res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado.' });
    }
};





module.exports = {
    getRegistroxUsuario,getRegLlamadaxAreaEstado,getRegistroPorcentajexArea,getRegLlamadaxTipoxAsesor
};
