import express from "express";
import passport from "passport";
import { checkRole } from "../middleware/checkrole.js";

// llama las clases del contorlador

import { AdminMovieController, AdminCategoryController } from "../controllers/adminController.js";

const router = express.Router();

// ====================== Rutas de Películas  ======================


// en las funciones, autentica con passport

// Añadir película
router.post(
  "/peliculas",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  AdminMovieController.add
);

// Actualizar película
router.put(
  "/peliculas/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  AdminMovieController.update
);

// Eliminar película
router.delete(
  "/peliculas/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  AdminMovieController.delete
);

// ====================== Rutas de Categorías  ======================

// Añadir categoría
router.post(
  "/categorias",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  AdminCategoryController.add
);

// Actualizar categoría
router.put(
  "/categorias/:id_genero",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  AdminCategoryController.update
);

// Eliminar categoría
router.delete(
  "/categorias/:id_genero",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  AdminCategoryController.delete
);

export default router;
