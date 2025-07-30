// /controllers/dashboardController.js
const { sequelize } = require("../config/dbConfig"); // Conexión a la base de datos
const { QueryTypes } = require('sequelize'); // Importamos QueryTypes de Sequelize para consultas SQL crudas

// Función para consumir el procedimiento almacenado
const getCombosIncidencia = async (req, res) => {
  try {
    // Ejecutamos el procedimiento almacenado
    const result = await sequelize.query('CALL sp_combosIncidencia()', {
      type: QueryTypes.SELECT, // Especificamos que esperamos un resultado
    });

    // Si obtenemos resultados
    if (result && result.length > 0) {
      // Filtramos el resultado para devolver solo los datos que necesitamos
      // El resultado de la consulta es un array, por lo que eliminamos los metadatos
      // y nos quedamos solo con los datos
      const data = result[0]; // `result[0]` debería contener el primer conjunto de datos

      return res.status(200).json(data); // Devolvemos los resultados como JSON
    } else {
      return res.status(404).json({ message: 'No se encontraron datos.' });
    }
  } catch (error) {
    console.error('Error al ejecutar el procedimiento almacenado:', error);
    return res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado.' });
  }
};

const getIncidenciasxCantidad = async(req,res) =>{
    try {
        // Ejecutamos el procedimiento almacenado
        const result = await sequelize.query('CALL sp_incidenciaBarra()', {
          type: QueryTypes.SELECT, // Especificamos que esperamos un resultado
        });
    
        // Si obtenemos resultados
        if (result && result.length > 0) {
          // Filtramos el resultado para devolver solo los datos que necesitamos
          // El resultado de la consulta es un array, por lo que eliminamos los metadatos
          // y nos quedamos solo con los datos
          const data = result[0]; // `result[0]` debería contener el primer conjunto de datos
    
          return res.status(200).json(data); // Devolvemos los resultados como JSON
        } else {
          return res.status(404).json({ message: 'No se encontraron datos.' });
        }
      } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado.' });
      }
    
};

const getIncidenciaxArea = async(req,res) =>{
    try {
        // Ejecutamos el procedimiento almacenado
        const result = await sequelize.query('CALL sp_incidenciaxArea()', {
          type: QueryTypes.SELECT, // Especificamos que esperamos un resultado
        });
    
        // Si obtenemos resultados
        if (result && result.length > 0) {
          // Filtramos el resultado para devolver solo los datos que necesitamos
          // El resultado de la consulta es un array, por lo que eliminamos los metadatos
          // y nos quedamos solo con los datos
          const data = result[0]; // `result[0]` debería contener el primer conjunto de datos
    
          return res.status(200).json(data); // Devolvemos los resultados como JSON
        } else {
          return res.status(404).json({ message: 'No se encontraron datos.' });
        }
      } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado.' });
      }
};

const getIncidenciaxPrioridad = async(req,res) =>{
    try {
        // Ejecutamos el procedimiento almacenado
        const result = await sequelize.query('CALL sp_incidenciaxPrioridad();', {
          type: QueryTypes.SELECT, // Especificamos que esperamos un resultado
        });
    
        // Si obtenemos resultados
        if (result && result.length > 0) {
          // Filtramos el resultado para devolver solo los datos que necesitamos
          // El resultado de la consulta es un array, por lo que eliminamos los metadatos
          // y nos quedamos solo con los datos
          const data = result[0]; // `result[0]` debería contener el primer conjunto de datos
    
          return res.status(200).json(data); // Devolvemos los resultados como JSON
        } else {
          return res.status(404).json({ message: 'No se encontraron datos.' });
        }
      } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado.' });
      }
}

const getTipoxPrioridad = async(req,res) =>{
    try {
        // Ejecutamos el procedimiento almacenado
        const result = await sequelize.query('CALL sp_tipoxPrioridad()', {
          type: QueryTypes.SELECT, // Especificamos que esperamos un resultado
        });
    
        // Si obtenemos resultados
        if (result && result.length > 0) {
          // Filtramos el resultado para devolver solo los datos que necesitamos
          // El resultado de la consulta es un array, por lo que eliminamos los metadatos
          // y nos quedamos solo con los datos
          const data = result[0]; // `result[0]` debería contener el primer conjunto de datos
    
          return res.status(200).json(data); // Devolvemos los resultados como JSON
        } else {
          return res.status(404).json({ message: 'No se encontraron datos.' });
        }
      } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado.' });
      }
}

const getIncidenciaxFechaTipo = async(req,res) =>{
    try {
        // Ejecutamos el procedimiento almacenado
        const result = await sequelize.query('CALL sp_incidenciaxFechaTipo()', {
          type: QueryTypes.SELECT, // Especificamos que esperamos un resultado
        });
    
        // Si obtenemos resultados
        if (result && result.length > 0) {
          // Filtramos el resultado para devolver solo los datos que necesitamos
          // El resultado de la consulta es un array, por lo que eliminamos los metadatos
          // y nos quedamos solo con los datos
          const data = result[0]; // `result[0]` debería contener el primer conjunto de datos
    
          return res.status(200).json(data); // Devolvemos los resultados como JSON
        } else {
          return res.status(404).json({ message: 'No se encontraron datos.' });
        }
      } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado.' });
      }
}

const getAreaxPrioridad = async(req,res) =>{
    try {
        // Ejecutamos el procedimiento almacenado
        const result = await sequelize.query('CALL sp_areaxPrioridad()', {
          type: QueryTypes.SELECT, // Especificamos que esperamos un resultado
        });
    
        // Si obtenemos resultados
        if (result && result.length > 0) {
          // Filtramos el resultado para devolver solo los datos que necesitamos
          // El resultado de la consulta es un array, por lo que eliminamos los metadatos
          // y nos quedamos solo con los datos
          const data = result[0]; // `result[0]` debería contener el primer conjunto de datos
    
          return res.status(200).json(data); // Devolvemos los resultados como JSON
        } else {
          return res.status(404).json({ message: 'No se encontraron datos.' });
        }
      } catch (error) {
        console.error('Error al ejecutar el procedimiento almacenado:', error);
        return res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado.' });
      }
}

const getIncidenciasxUsuarioMes = async(req,res) =>{
  try {
      // Ejecutamos el procedimiento almacenado
      const result = await sequelize.query('CALL sp_incidenciasxusuario_mes()', {
        type: QueryTypes.SELECT, // Especificamos que esperamos un resultado
      });
  
      // Si obtenemos resultados
      if (result && result.length > 0) {
        // Filtramos el resultado para devolver solo los datos que necesitamos
        // El resultado de la consulta es un array, por lo que eliminamos los metadatos
        // y nos quedamos solo con los datos
        const data = result[0]; // `result[0]` debería contener el primer conjunto de datos
  
        return res.status(200).json(data); // Devolvemos los resultados como JSON
      } else {
        return res.status(404).json({ message: 'No se encontraron datos.' });
      }
    } catch (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      return res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado.' });
    }
}

const getIncidenciasxUsuarioDia = async(req,res) =>{
  try {
      // Ejecutamos el procedimiento almacenado
      const result = await sequelize.query('CALL sp_incidenciasxusuario_dia()', {
        type: QueryTypes.SELECT, // Especificamos que esperamos un resultado
      });
  
      // Si obtenemos resultados
      if (result && result.length > 0) {
        // Filtramos el resultado para devolver solo los datos que necesitamos
        // El resultado de la consulta es un array, por lo que eliminamos los metadatos
        // y nos quedamos solo con los datos
        const data = result[0]; // `result[0]` debería contener el primer conjunto de datos
  
        return res.status(200).json(data); // Devolvemos los resultados como JSON
      } else {
        return res.status(404).json({ message: 'No se encontraron datos.' });
      }
    } catch (error) {
      console.error('Error al ejecutar el procedimiento almacenado:', error);
      return res.status(500).json({ message: 'Error al ejecutar el procedimiento almacenado.' });
    }
}

module.exports = {
  getCombosIncidencia,getIncidenciasxCantidad,getIncidenciaxArea,getIncidenciaxPrioridad,getTipoxPrioridad,getIncidenciaxFechaTipo,getAreaxPrioridad,getIncidenciasxUsuarioDia,getIncidenciasxUsuarioMes
};
