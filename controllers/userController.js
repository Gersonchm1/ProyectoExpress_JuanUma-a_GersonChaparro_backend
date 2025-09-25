import { client } from "../config/db.js";
import {   UserModelRegister, UserModelMovie, UserModelComments,   UserModelRatings } from "../models/userModel.js";

const userModel = new UserModelRegister();
const movieModel = new UserModelMovie();
const commentModel = new UserModelComments();
const ratingModel = new UserModelRatings();


export class  UserController {
  // Registrar usuario


  static async register(req, res) {
    const session = client.startSession();
    try {
      // recibe los datos del body
      const { nombre, correo, contrasena } = req.body;
  
      // trae la funcion del model e inserta los datos 
      const result = await userModel.registerUser({
        name: nombre,       
        email: correo,      
        password: contrasena 
      }, session);
  // REspuestas
      res.status(201).json({
        msg: "Usuario registrado con éxito",
        id: result._id,
      });
    } catch (error) {
      res.status(500).json({ msg: "Error al registrar usuario", error: error.message });
    } finally {
      await session.endSession();
    }
  }
  
  static async login(req, res) {
    try {
      const { email, contrasena } = req.body;

      // Llamada al modelo para validar usuario y generar token
      const data = await userModel.loginUser({ email, password: contrasena });

      const mensaje = data.user.role === "admin" 
      ? "Bienvenido administrador" 
      : `Bienvenido ${data.user.name}`;

      res.json({
        msg: `Bienvenido ${data.user.role === "admin" ? "administrador" : "usuario"}`,
        user: data.user,
        token: `Bearer ${data.token}`
      });
    } catch (error) {
      res.status(500).json({ msg: "Error al iniciar sesión", error: error.message });
    }
  }
}

export class MovieController {
  static async viewMovies(req, res) {
    try {
      await movieModel.init();
      const movies = await movieModel.viewMovie();
      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ msg: "Error al obtener películas", error: error.message });
    }
  }

  static async topMovies(req, res) {
    try {
      await movieModel.init();
      const limit = parseInt(req.query.limit) || 20;
      const movies = await movieModel.topMoviesByViews(limit);
      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ msg: "Error al obtener top películas", error: error.message });
    }
  }

  static async incrementViews(req, res) {
    try {
      await movieModel.init();
      const { id } = req.params; // /movies/:id/views
      const result = await movieModel.incrementViews(id);
      return res.json({ msg: "Vistas incrementadas", result });
    } catch (error) {
      return res.status(500).json({ msg: "Error al incrementar vistas", error: error.message });
    }
  }
}


export class CommentController {
  static async viewAll(req, res) {
    try {
      await commentModel.init();
      const comments = await commentModel.viewComment();
      return res.json(comments);
    } catch (error) {
      return res.status(500).json({ msg: "Error al obtener comentarios", error: error.message });
    }
  }

  static async viewByMovie(req, res) {
    try {
      await commentModel.init();
      const { movieId } = req.params;
      const comments = await commentModel.viewCommentByMovie(movieId);
      return res.json(comments);
    } catch (error) {
      return res.status(500).json({ msg: "Error al obtener comentarios por película", error: error.message });
    }
  }

  static async add(req, res) {
    try {
      await commentModel.init();
      const { movieId, userId } = req.params;
      const result = await commentModel.addComment(req.body, movieId, userId);
      return res.status(201).json({ msg: "Comentario agregado", result });
    } catch (error) {
      return res.status(500).json({ msg: "Error al agregar comentario", error: error.message });
    }
  }

  static async countByMovie(req, res) {
    try {
      await commentModel.init();
      const { movieId } = req.params;
      const total = await commentModel.countCommentsByMovie(movieId);
      return res.json({ movieId, totalComentarios: total });
    } catch (error) {
      return res.status(500).json({ msg: "Error al contar comentarios", error: error.message });
    }
  }

  static async deleteByMovie(req, res) {
    try {
      await commentModel.init();
      const { movieId } = req.params;
      const result = await commentModel.deleteComments(movieId);
      return res.json({ msg: "Comentarios eliminados", result });
    } catch (error) {
      return res.status(500).json({ msg: "Error al eliminar comentarios", error: error.message });
    }
  }

  static async update(req, res) {
    try {
      await commentModel.init();
      const { movieId, userId } = req.params;
      const result = await commentModel.UpdateComments(req.body, movieId, userId);
      return res.json({ msg: "Reseña actualizada", result });
    } catch (error) {
      return res.status(500).json({ msg: "Error al actualizar reseña", error: error.message });
    }
  }
}

export class RatingController {
  static async add(req, res) {
    try {
      await ratingModel.init();
      const { movieId, userId } = req.params;
      const result = await ratingModel.addRating(req.body, movieId, userId);
      return res.status(201).json({ msg: "Rating agregado", result });
    } catch (error) {
      return res.status(500).json({ msg: "Error al agregar rating", error: error.message });
    }
  }

  static async viewAll(req, res) {
    try {
      await ratingModel.init();
      const ratings = await ratingModel.viewRating();
      return res.json(ratings);
    } catch (error) {
      return res.status(500).json({ msg: "Error al obtener ratings", error: error.message });
    }
  }

  static async topRated(req, res) {
    try {
      await ratingModel.init();
      const limit = parseInt(req.query.limit) || 20;
      const result = await ratingModel.topRatedMovies(limit);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ msg: "Error al obtener top por rating", error: error.message });
    }
  }
}