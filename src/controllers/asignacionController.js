// /controllers/dashboardController.js
const sequelize = require('../config/dbConfig'); // Conexión a la base de datos
const { QueryTypes } = require('sequelize');
const Asignaciones = require("../models/asignaciones");
const Producto = require("../models/producto"); // Importamos el modelo Producto

const getAsignacion = async (req, res) =>{
    try {
        // Ejecutamos el procedimiento almacenado
        const result = await sequelize.query('CALL sp_ListadoAsignacion();', {
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


// const guardarAsignacion = async (req, res) => {
//     const { id_usuario, id_producto, cantidad } = req.body;

//     try {
//         // Validar que los campos requeridos estén presentes
//         if (!id_usuario || !id_producto || !cantidad) {
//             return res.status(400).json({ message: "Todos los campos son obligatorios" });
//         }

//         // Verificar el stock del producto
//         const producto = await Producto.findOne({ where: { ID_Producto: id_producto } });
//         if (!producto) {
//             return res.status(404).json({ message: "Producto no encontrado" });
//         }

//         if (producto.Cantidad < cantidad) {
//             return res.status(400).json({
//                 message: `Stock insuficiente. Solo quedan ${producto.Cantidad} unidades disponibles.`
//             });
//         }

//         // Crear la nueva asignación
//         const nuevaAsignacion = await Asignaciones.create({
//             id_usuario,
//             id_producto,
//             cantidad,
//             estado : 1,
//         });


//         // Actualizar el stock del producto
//         producto.Cantidad -= cantidad;
//         await producto.save();

//         return res.status(201).json({
//             message: "Asignación creada exitosamente",
//             asignacion: nuevaAsignacion
//         });
//     } catch (error) {
//         console.error("Error al guardar la asignación:", error);
//         return res.status(500).json({
//             message: "Error al guardar la asignación",
//             error: error.message
//         });
//     }
// };

const guardarAsignacion = async (req, res) => {
    const { id_usuario, id_producto, cantidad, Numero_Serie } = req.body;

    try {
        if (!id_usuario || !id_producto || !cantidad || !Numero_Serie) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const producto = await Producto.findOne({ where: { ID_Producto: id_producto } });
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Si el campo Stock_Asignado es null, lo tratamos como 0
        const stockAsignado = producto.Stock_Asignado || 0;
        const disponible = producto.Cantidad - stockAsignado;

        if (cantidad > disponible) {
            return res.status(400).json({
                message: `Stock insuficiente. Solo se pueden asignar ${disponible} unidades.`
            });
        }

        // Crear la asignación
        const nuevaAsignacion = await Asignaciones.create({
            id_usuario,
            id_producto,
            cantidad,
            Numero_Serie,
            estado: 1,
        });

        // Actualizar el campo Stock_Asignado sumando lo asignado
        producto.Stock_Asignado = stockAsignado + cantidad;
        await producto.save();

        return res.status(201).json({
            message: "Asignación creada exitosamente",
            asignacion: nuevaAsignacion
        });
    } catch (error) {
        console.error("Error al guardar la asignación:", error);
        return res.status(500).json({
            message: "Error al guardar la asignación",
            error: error.message
        });
    }
};



// const editarAsignacion = async (req, res) => {
//     const { id_asignacion } = req.params;
//     const { id_usuario, id_producto, cantidad } = req.body;

//     try {
//         // Validar que el ID de la asignación exista
//         const asignacion = await Asignaciones.findOne({ where: { id_asignacion } });
//         if (!asignacion) {
//             return res.status(404).json({ message: "Asignación no encontrada" });
//         }

//         // Verificar el stock del producto si se cambia la cantidad o el producto
//         if (id_producto && cantidad) {
//             const producto = await Producto.findOne({ where: { ID_Producto: id_producto } });
//             if (!producto) {
//                 return res.status(404).json({ message: "Producto no encontrado" });
//             }

//             const stockRestante = producto.Cantidad + asignacion.cantidad - cantidad;
//             if (stockRestante < 0) {
//                 return res.status(400).json({
//                     message: `Stock insuficiente. Solo quedan ${producto.Cantidad} unidades disponibles.`
//                 });
//             }

//             producto.Cantidad = stockRestante;
//             await producto.save();
//         }

//         // Actualizar la asignación
//         await asignacion.update({ id_usuario, id_producto, cantidad });

//         return res.status(200).json({
//             message: "Asignación actualizada exitosamente",
//             asignacion
//         });
//     } catch (error) {
//         console.error("Error al editar la asignación:", error);
//         return res.status(500).json({
//             message: "Error al editar la asignación",
//             error: error.message
//         });
//     }
// };


const editarAsignacion = async (req, res) => {
    const { id_asignacion } = req.params;
    const { id_usuario, id_producto, cantidad } = req.body;

    try {
        const asignacion = await Asignaciones.findOne({ where: { id_asignacion } });
        if (!asignacion) {
            return res.status(404).json({ message: "Asignación no encontrada" });
        }

        const producto = await Producto.findOne({ where: { ID_Producto: id_producto } });
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const stockAsignado = producto.Stock_Asignado || 0;
        const diferencia = cantidad - asignacion.cantidad; 
        const disponible = producto.Cantidad - stockAsignado;

        // Si estamos aumentando la asignación, validamos que haya stock disponible
        if (diferencia > 0 && disponible < diferencia) {
            return res.status(400).json({
                message: `Stock insuficiente. Solo se pueden asignar ${disponible} unidades adicionales.`
            });
        }

        // Actualizar el stock asignado
        producto.Stock_Asignado = stockAsignado + diferencia;

        // Guardar cambios en producto y asignación
        await producto.save();
        await asignacion.update({ id_usuario, id_producto, cantidad });

        return res.status(200).json({
            message: "Asignación actualizada exitosamente",
            asignacion
        });
    } catch (error) {
        console.error("Error al editar la asignación:", error);
        return res.status(500).json({
            message: "Error al editar la asignación",
            error: error.message
        });
    }
};


// const eliminarAsignacion = async (req, res) => {
//     const { id_asignacion } = req.params;

//     try {
//         // Validar que el ID de la asignación exista
//         const asignacion = await Asignaciones.findOne({ where: { id_asignacion } });
//         if (!asignacion) {
//             return res.status(404).json({ message: "Asignación no encontrada" });
//         }

//         // Cambiar el estado de la asignación a 0 (eliminado)
//         await asignacion.update({ estado: 0 });

//         return res.status(200).json({
//             message: "Asignación eliminada exitosamente",
//             asignacion
//         });
//     } catch (error) {
//         console.error("Error al eliminar la asignación:", error);
//         return res.status(500).json({
//             message: "Error al eliminar la asignación",
//             error: error.message
//         });
//     }
// };
const eliminarAsignacion = async (req, res) => {
    const { id_asignacion } = req.params;

    try {
        const asignacion = await Asignaciones.findOne({ where: { id_asignacion } });
        if (!asignacion) {
            return res.status(404).json({ message: "Asignación no encontrada" });
        }

        const producto = await Producto.findOne({ where: { ID_Producto: asignacion.id_producto } });
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Restar la cantidad asignada del campo Stock_Asignado del producto
        const cantidadAsignada = asignacion.cantidad || 0;
        const stockAsignadoActual = producto.Stock_Asignado || 0;

        const nuevoStockAsignado = Math.max(stockAsignadoActual - cantidadAsignada, 0); // Previene valores negativos
        producto.Stock_Asignado = nuevoStockAsignado;

        await producto.save();

        // Marcar la asignación como eliminada (estado = 0), sin tocar cantidad
        await asignacion.update({ estado: 0 });

        return res.status(200).json({
            message: "Asignación eliminada exitosamente",
            asignacion
        });
    } catch (error) {
        console.error("Error al eliminar la asignación:", error);
        return res.status(500).json({
            message: "Error al eliminar la asignación",
            error: error.message
        });
    }
};




module.exports = {getAsignacion,guardarAsignacion,editarAsignacion,eliminarAsignacion}