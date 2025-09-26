

// guarda los roles que rebcibe y lee la req y res
export const checkRole = (...roles) => (req, res, next) => {

  // si la req no encuentra el jwt lanza error
    if (!req.user) return res.status(401).json({ msg: "Usuario no autenticado" });
    // si no se encuentra rol , lanza error
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Acceso denegado" });
    }
    // Si todo esta correcto deja pasar la solicitud
    next();
  };