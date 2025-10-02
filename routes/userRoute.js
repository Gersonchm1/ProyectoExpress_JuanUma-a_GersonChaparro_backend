import express from "express";
import passport from "passport";
import rateLimit from "express-rate-limit"; 
import { checkRole } from "../middleware/checkrole.js";
import { addVersion } from "../middleware/version.js"; 

import { UserController, MovieController, CommentController, RatingController } from "../controllers/userController.js";

const router = express.Router();

router.use(addVersion); 

// Limita la cantidad de intentos de login 
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 10000, //por 15 minutos 20 intemtos
  max: 200,
  message: "Demasiados intentos de login desde esta IP, inténtalo más tarde.",
});

//  Rutas públicas en las cuales el login 
router.post("/register", UserController.register);
router.post("/login", loginLimiter, UserController.login);

//  Middleware de autenticación con passport
router.use(passport.authenticate("jwt", { session: false }));

// Perfil del usuario autenticado
router.get("/profile", (req, res) => {
  res.json({ msg: "Perfil del usuario autenticado", user: req.user });
});

// Ruta admin (solo role = admin)
router.get("/admin", checkRole("admin"), (req, res) => {
  res.json({ msg: "Bienvenido administrador", user: req.user });
});

// Que solo el admin pueda buscar usuario por id 


// ====================== Rutas Películas ======================
router.get("/peliculas", MovieController.viewMovies);
router.get("/peliculas/top", MovieController.topMovies);
router.put("/peliculas/:id/views", MovieController.incrementViews);
router.get("/peliculas/categoria/:id_genero", MovieController.viewByCategory);
router.get("/peliculas/:id", MovieController.findById);


// ====================== Rutas Ratings ======================
router.get("/ratings/:id_pelicula", RatingController.viewAll);
router.post("/ratings/:id_pelicula/:id_usuario", RatingController.add);
router.get("/ratings/top", RatingController.topRated);

// ====================== Rutas Comentarios ======================
router.get("/resenas", CommentController.viewAll);
router.get("/resenas/:id_pelicula", CommentController.viewByMovie);
router.post("/resenas/:id_pelicula/:id_usuario", CommentController.add);
router.put("/resenas/:id_pelicula/:id_usuario", CommentController.update);
router.delete("/resenas/:id_usuario/:id_pelicula/:id_comentario", CommentController.deleteByMovie);
router.get("/resenas/:id_pelicula/count", CommentController.countByMovie);

export default router;