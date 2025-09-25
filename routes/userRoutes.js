import express from "express";
import passport from "passport";
import rateLimit from "express-rate-limit"; 
import { checkRole } from "../middleware/checkrole.js";

import { UserController, MovieController, CommentController, RatingController } from "../controllers/userController.js";

const router = express.Router();

// Limitado la cantidad de intentos de login 
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,
  message: "Demasiados intentos de login desde esta IP, inténtalo más tarde.",
});

//  Rutas públicas
router.post("/register", UserController.register);
router.post("/login", loginLimiter, UserController.login);

//  Middleware de autenticación
router.use(passport.authenticate("jwt", { session: false }));

// Perfil del usuario autenticado
router.get("/profile", (req, res) => {
  res.json({ msg: "Perfil del usuario autenticado", user: req.user });
});

// Ruta admin (solo role = admin)
router.get("/admin", checkRole("admin"), (req, res) => {
  res.json({ msg: "Bienvenido administrador", user: req.user });
});


// ====================== Películas ======================
router.get("/peliculas", MovieController.viewMovies);
router.get("/peliculas/top", MovieController.topMovies);
router.put("/peliculas/:id/views", MovieController.incrementViews);

// ====================== Ratings ======================
router.get("/ratings", RatingController.viewAll);
router.post("/ratings/:id_pelicula/:id_usuario", RatingController.add);
router.get("/ratings/top", RatingController.topRated);

// ====================== Comentarios ======================
router.get("/resenas", CommentController.viewAll);
router.get("/resenas/:id_pelicula", CommentController.viewByMovie);
router.post("/resenas/:id_pelicula/:id_usuario", CommentController.add);
router.put("/resenas/:id_pelicula/:id_usuario", CommentController.update);
router.delete("/resenas/:id_pelicula", CommentController.deleteByMovie);
router.get("/resenas/:id_pelicula/count", CommentController.countByMovie);

export default router;
