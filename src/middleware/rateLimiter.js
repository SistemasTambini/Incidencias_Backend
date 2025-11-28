const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

// Limita el login: máximo 5 intentos por minuto
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 5,
  message: { message: "Demasiados intentos de login. Intente de nuevo en 1 minuto." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Ralentiza peticiones al login tras varios intentos


const loginSpeedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 3,
  delayMs: (used, req) => {
    const delayAfter = req.slowDown.limit;
    return (used - delayAfter) * 500; // 500ms extra por cada intento después del límite
  },
  validate: { delayMs: false } // opcional: desactiva el warning
});

// Limita cualquier otro endpoint (100 peticiones por 15 minutos)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { message: "Has superado el límite de peticiones. Intenta más tarde." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  loginSpeedLimiter,
  apiLimiter,
};
