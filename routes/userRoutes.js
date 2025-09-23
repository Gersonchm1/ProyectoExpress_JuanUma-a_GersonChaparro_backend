import express from "express";
import passport from "passport";
import rateLimit from "express-rate-limit"; 
import {UserController} from "../controllers/userController.js";

const router = express.Router();

// Middleware de roles (lo definimos en este archivo)
function checkRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "No autenticado" });
    }
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ msg: "Acceso denegado" });
    }
    next();
  };
}

// Aplicando rate limit (ejemplo: proteger login contra ataques de fuerza bruta)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 solicitudes en ese tiempo
  message: "Demasiados intentos de login desde esta IP, inténtalo más tarde.",
});

// Registro (público)
router.post("/register", UserController.register);

// Login (público, pero con limitador)
router.post("/login", loginLimiter, UserController.login);

// Ruta protegida: solo usuarios autenticados (Passport verifica JWT)
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      msg: "Perfil del usuario autenticado",
      user: req.user,
    });
  }
);

// Ruta protegida: solo admin
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"), // validación del rol
  (req, res) => {
    res.json({
      msg: "Bienvenido administrador",
      user: req.user,
    });
  }
);

export default router;
