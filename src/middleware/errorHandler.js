const errorHandler = (err, req, res, next) => {
    // Si el error tiene un mensaje, lo usa, si no usa uno genérico
    const message = err.message || "Error interno del servidor";
  
    // Verifica si el error es un 400 (Bad Request) o un 500 (Internal Server Error)
    const statusCode = err.statusCode || 500;
  
    res.status(statusCode).json({
      message,
      // Solo mostramos el stack en modo desarrollo
      ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
  };
  
  module.exports = errorHandler;
  