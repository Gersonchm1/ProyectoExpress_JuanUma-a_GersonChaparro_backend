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

// ###################################################################################################
                                //PELICULAS
//####################################################################################################
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
      const limit = parseInt(req.query.limit)|| 20;
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

// #############################################################################################################
//                                               COMENTARIOS
//##############################################################################################################

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

      // saca el id de la pelicula de los parametros
      const { id_pelicula } = req.params;

      // Luego , llama a la funcion de ver comentarios por pelicula, tomando el id como referencia
      const comments = await commentModel.viewCommentByMovie(id_pelicula);

      // Devuelve la resuesta en json, y lnza si hay error
      return res.json(comments);
    } catch (error) {
      return res.status(500).json({ msg: "Error al obtener comentarios por película", error: error.message });
    }
  }

  static async add(req, res) {
    try {
      // iniciamos el modelo de comentarios 
      await commentModel.init();

      //recibimos el id del usuario y de la pelicula
      const { id_pelicula, id_usuario } = req.params;

      // luego llamamos a la funcion para añadir comentarrs y que reciba la data y los ids
      const result = await commentModel.addComment(req.body, id_pelicula, id_usuario);
      // luego develve la respuesa en json y notifica si hay error o no
      return res.status(201).json({ msg: "Comentario agregado", result });
    } catch (error) {
      return res.status(500).json({ msg: "Error al agregar comentario", error: error.message });
    }
  }

  static async countByMovie(req, res) {
    try {
      // inicamos el modelo de comentario
      await commentModel.init();
      //Recibimos el id de pelicula de los parametros
      const { id_pelicula } = req.params;

      // Luego llama la funcion para llamar contar los comentarios por pelicula 
      const total = await commentModel.countCommentsByMovie(id_pelicula);
      // damos la respuesta en json, con el id de la pelicula y el total de comentarios, sino, lanza error
      return res.json({ id_pelicula, totalComentarios: total });
    } catch (error) {
      return res.status(500).json({ msg: "Error al contar comentarios", error: error.message });
    }
  }

  static async deleteByMovie(req, res) {
    try {
      // iniciamos el modelo
      await commentModel.init();

      // tomamos el id de la pelicula 
      const { id_pelicula } = req.params;

      // luego lama a la funcion de eliminarcomentarios de la pelicula
      const result = await commentModel.deleteComments(id_pelicula);
      // devuelve un json con la informacion eliminada , sino, lanza error
      return res.json({ msg: "Comentarios eliminados", result });
    } catch (error) {
      return res.status(500).json({ msg: "Error al eliminar comentarios", error: error.message });
    }
  }

  static async update(req, res) {
    try {

      // iniciamos el modelo de comentarios
      await commentModel.init();
      // recbimos los dats de los parametros 
      const { id_pelicula, id_usuario } = req.params;

      // ejecutamos la funcion update commets con el id de pelicula, de usuaro y la informacion del body 
      const result = await commentModel.UpdateComments(req.body, id_pelicula, id_usuario);

      // Devuelve la respuesta de la informacion en json , ysi hay error , lo notifica
      return res.json({ msg: "Reseña actualizada", result });
    } catch (error) {
      return res.status(500).json({ msg: "Error al actualizar reseña", error: error.message });
    }
  }
}

//#################################################################################
//                                        RATINGS
//#################################################################################


export class RatingController {
  static async add(req, res) {
    try {
      // inicializamos el modelo de rating
      await ratingModel.init();
      // recibimos los atributos de los parametros 
      const { id_pelicula, id_usuario } = req.params;

      // llamamos a la funcion para añadir rating y que recibe lada y los ids , de usuario y pelicula
      const result = await ratingModel.addRating(req.body, id_pelicula, id_usuario);
      // devuelve la respuesta y la inf en json , si hay algun error, notifica
      return res.status(201).json({ msg: "Rating agregado", result });
    } catch (error) {
      return res.status(500).json({ msg: "Error al agregar rating", error: error.message });
    }
  }

  static async viewAll(req, res) {
    try {

      // Iniciamos el modelo de rating
      await ratingModel.init();

      // llamamos la funcion de ver ratings
      const ratings = await ratingModel.viewRating();
      return res.json(ratings);
    } catch (error) {
      return res.status(500).json({ msg: "Error al obtener ratings", error: error.message });
    }
  }

  static async topRated(req, res) {
    try {
      // Iniciamos el modelo e rating
      await ratingModel.init();

      // volvemos el limite de la query int, y le ponemos 20 por si algo fall a
      const limit = parseInt(req.query.limit) || 20;
      // llamaos a la funcion para ver las peliculas mejor calificadas
      const result = await ratingModel.topRatedMovies(limit);
      // devuelve la respuesta en json , y si algo falla, lanza error
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ msg: "Error al obtener top por rating", error: error.message });
    }
  }
}