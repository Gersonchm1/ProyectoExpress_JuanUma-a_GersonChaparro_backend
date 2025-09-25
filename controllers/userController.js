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


      // Si el rol es administrador pone un mensaje , sino , da el nombre
      const mensaje = data.user.role === "admin" 
      ? "Bienvenido administrador" 
      : `Bienvenido ${data.user.nombre}`;

      // Envia la respuest json
      res.json({
        // Dice bienvenido y comprueba qeu sea admin, hace un uf con ?:. si lo es, dice bienvenido administrador, sino, usuario 
        msg: `Bienvenido ${data.user.role === "admin" ? "administrador" : "usuario"}`,
        user: data.user,
        token: `Bearer ${data.token}`
      });
      // si algo falla lanza error
    } catch (error) {
      res.status(500).json({ msg: "Error al iniciar sesión", error: error.message });
    }
  }
}

export class MovieController {
  static async viewMovies(req, res) {
    try {
      // inicia el modelo de peliculas
      await movieModel.init();
      // activa la funcion de ver las peliclas y las deviuelve en formato json 
      const movies = await movieModel.viewMovie();
     // devuelve las peliculas, si algo falla , lanza  error
      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ msg: "Error al obtener películas", error: error.message });
    }
  }

  static async topMovies(req, res) {
    try {
      //  el modelo de las peliculas
      await movieModel.init();
      // vuelve limit, un entero
      const limit = parseInt(req.query.limit)
      // Hace la funcion del model con el parametro que es el limit 
      const movies = await movieModel.topMoviesByViews(limit);
      // devuelve la funcion, sino, lanza error
      return res.json(movies);
    } catch (error) {
      return res.status(500).json({ msg: "Error al obtener top películas", error: error.message });
    }
  }

  static async incrementViews(req, res) {
    try {
      await movieModel.init();

      // saca el id de los prametros
      const { id } = req.params; 

      // Con el id de la pelicula , incrementa las vistas
      const result = await movieModel.incrementViews(id);
      // si es exitoso , lanza una respuesta en json con la informacion, sino , lanza error
      return res.json({ msg: "Vistas incrementadas", result });
    } catch (error) {
      return res.status(500).json({ msg: "Error al incrementar vistas", error: error.message });
    }
  }
}


export class CommentController {
  static async viewAll(req, res) {
    try {
      // inicia el modelo
      await commentModel.init();
      // utiliza la funcion del modelo y la pone en una variable 
      const comments = await commentModel.viewComment();
      // devuelve esa inforacion en json, si algo falla, lanza error
      return res.json(comments);
    } catch (error) {
      return res.status(500).json({ msg: "Error al obtener comentarios", error: error.message });
    }
  }

  static async viewByMovie(req, res) {
    try {
      // inicia el modelo de comentarios
      await commentModel.init();

      const { id_pelicula } = req.params;
      const comments = await commentModel.viewCommentByMovie(id_pelicula);
      return res.json(comments);
    } catch (error) {
      return res.status(500).json({ msg: "Error al obtener comentarios por película", error: error.message });
    }
  }

  static async add(req, res) {
    try {
      await commentModel.init();
      const { id_pelicula, id_usuario } = req.params;
      const result = await commentModel.addComment(req.body, id_pelicula, id_usuario);
      return res.status(201).json({ msg: "Comentario agregado", result });
    } catch (error) {
      return res.status(500).json({ msg: "Error al agregar comentario", error: error.message });
    }
  }

  static async countByMovie(req, res) {
    try {
      await commentModel.init();
      const { id_pelicula } = req.params;
      const total = await commentModel.countCommentsByMovie(id_pelicula);
      return res.json({ id_pelicula, totalComentarios: total });
    } catch (error) {
      return res.status(500).json({ msg: "Error al contar comentarios", error: error.message });
    }
  }

  static async deleteByMovie(req, res) {
    try {
      await commentModel.init();
      const { id_pelicula } = req.params;
      const result = await commentModel.deleteComments(id_pelicula);
      return res.json({ msg: "Comentarios eliminados", result });
    } catch (error) {
      return res.status(500).json({ msg: "Error al eliminar comentarios", error: error.message });
    }
  }

  static async update(req, res) {
    try {
      await commentModel.init();
      const { id_pelicula, id_usuario } = req.params;
      const result = await commentModel.UpdateComments(req.body, id_pelicula, id_usuario);
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
      const { id_pelicula, id_usuario } = req.params;
      const result = await ratingModel.addRating(req.body, id_pelicula, id_usuario);
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