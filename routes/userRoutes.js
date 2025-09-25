import express from "express";
import passport from "passport";
import rateLimit from "express-rate-limit"; 
import { UserController } from "../controllers/userController.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = express.Router();

// Limitado la cantidad de intentos de login 
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20,
  message: "Demasiados intentos de login desde esta IP, inténtalo más tarde.",
});

//  Rutas públicas para registrar y login ,la cual incluye el limitador de solicitudes
router.post("/register", UserController.register);
router.post("/login", loginLimiter, UserController.login);

//  Aqui empieza a pedir
router.use(passport.authenticate("jwt", { session: false }));

// Perfil del usuario autenticado
router.get("/profile", (req, res) => {
  res.json({ msg: "Perfil del usuario autenticado", user: req.user });
});

// Ruta admin (solo role = admin)
router.get("/admin", checkRole("admin"), (req, res) => {
  res.json({ msg: "Bienvenido administrador", user: req.user });
});

//  Rutas de películas
router.get("/peliculas", UserController.getPeliculas);
router.get("/peliculas/:id", UserController.getPeliculaById);
router.get("/peliculas/top-rated", UserController.getTopRatedMovies);
router.get("/peliculas/top-viewed", UserController.getTopViewedMovies);
router.patch("/peliculas/:id/views", UserController.incrementViews);

//  Rutas de ratings
router.get("/ratings", UserController.getAllRatings);
router.get("/ratings/:id_pelicula", UserController.getRatingsByMovie);
router.post("/ratings/:id_pelicula", UserController.addRating);
router.get("/ratings/top", UserController.getTopRatings);

//  Rutas de reseñas / comentarios
router.get("/resenas", UserController.getResenas);
router.get("/resenas/:id_resena", UserController.getResenaById);
router.put("/resenas/:id_resena", UserController.updateResena);
router.delete("/resenas/:id_resena", UserController.deleteResena);

router.get("/resenas/movie/:movieId", UserController.getResenasByMovie);
router.delete("/resenas/movie/:movieId", UserController.deleteResenasByMovie);
router.get("/resenas/movie/:movieId/count", UserController.countResenasByMovie);
router.post("/resenas/movie/:movieId/user/:userId", UserController.addResena);
router.put("/resenas/movie/:movieId/user/:userId", UserController.updateComment);

export default router;
