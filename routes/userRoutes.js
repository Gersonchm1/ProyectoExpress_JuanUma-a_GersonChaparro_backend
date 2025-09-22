





// Aplicando rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 60 solicitudes por IP
    message: "Demasiadas solicitudes desde esta IP, inténtalo más tarde."
  });