export const checkRole = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: "Usuario no autenticado" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Acceso denegado" });
    }
    next();
  };