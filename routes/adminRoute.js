import express from "express";
import passport from "passport";
import { checkRole } from "../middleware/checkrole.js";

// importa las funciones  para ver el body, los parametros y posibles errores de validacion
import { body, param, validationResult } from "express-validator";
import { AdminMovieController, AdminCategoryController } from "../controllers/adminController.js";

const router = express.Router();

// Middleware para validar errores de express-validator y devolver los errores en un array
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ====================== Rutas de Películas ======================


// en las rutas , autenticamos , revisamos el rol , validamos con validate y traemos las funciones del controller

// Añadir película
router.post(
  "/peliculas",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  [
    body("titulo").notEmpty().withMessage("El título es obligatorio"),
    body("descripcion").notEmpty().withMessage("La descripción es obligatoria"),
    body("anio").isInt({ min: 1950 }).withMessage("El año debe ser un número válido"),
  ],
  validate,
  AdminMovieController.add
);

// Actualizar película
router.put(
  "/peliculas/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  [
    param("id").notEmpty().withMessage("El id de la película es obligatorio"),
    body("titulo").optional().notEmpty().withMessage("El título no puede estar vacío"),
    body("descripcion").optional().notEmpty().withMessage("La descripción no puede estar vacía"),
    body("anio").optional().isInt({ min: 1950 }).withMessage("El año debe ser un número válido"),
    body("genero").optional().notEmpty().withMessage("El género no puede estar vacío"),
  ],
  validate,
  AdminMovieController.update
);

// Eliminar película
router.delete(
  "/peliculas/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  [
    param("id").notEmpty().withMessage("El id de la película es obligatorio")
  ],
  validate,
  AdminMovieController.delete
);

// ====================== Rutas de Categorías ======================

// Añadir categoría
router.post(
  "/categorias",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  [
    body("nombre").notEmpty().withMessage("El nombre de la categoría es obligatorio")
  ],
  validate,
  AdminCategoryController.add
);

// Actualizar categoría
router.put(
  "/categorias/:id_genero",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  [
    param("id_genero").notEmpty().withMessage("El id de la categoría es obligatorio"),
    body("nombre").optional().notEmpty().withMessage("El nombre no puede estar vacío")
  ],
  validate,
  AdminCategoryController.update
);

// Eliminar categoría
router.delete(
  "/categorias/:id_genero",
  passport.authenticate("jwt", { session: false }),
  checkRole("admin"),
  [
    param("id_genero").notEmpty().withMessage("El id de la categoría es obligatorio")
  ],
  validate,
  AdminCategoryController.delete
);

export default router;
