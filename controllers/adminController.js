import { AdminModelMovies } from "../models/adminModelMovies.js";
import { AdminModelCategory } from "../models/adminModelCategory.js";

// incializamos los modelos 
const adminMovies = new AdminModelMovies();
const adminCategories = new AdminModelCategory();


// #########################################################
//                      Películas
// #########################################################
export class AdminMovieController {
  static async add(req, res) {
    try {
        // inicia el modelo
      await adminMovies.init();
      // llama la funcion de añadir peliculas la informacion del body
      const result = await adminMovies.addMovies(req.body);

      // devuelve la respuesta en json, y si hay un error, lo notifica
      res.status(201).json({ msg: "Película agregada con éxito", result });
    } catch (error) {
      res.status(500).json({ msg: "Error al agregar película", error: error.message });
    }
  }

  static async update(req, res) {
    try {

        // incicia el modelo 
      await adminMovies.init();

      // saca el id de los parámetros
      const { id } = req.params; 

      // Llama la funcion para actualizar la pelicula 
      // con el body y el id
      const result = await adminMovies.UpdateMovie(req.body, id);

      // si todo va bien devuelve  la infirmacion, sino, lanza error
      res.json({ msg: "Película actualizada con éxito", result });
    } catch (error) {
      res.status(500).json({ msg: "Error al actualizar película", error: error.message });
    }
  }

  static async delete(req, res) {
    try {
        // inicia el modelo de peliculas
      await adminMovies.init();

      // de los parametros , saca el id
      const { id } = req.params; 
      // llama lafuncion de eliminar peliculas con el id
      const result = await adminMovies.deleteMovie(id);
    
      // si todo va bien , devuelve el resultdo , sino, da error
      res.json({ msg: "Película eliminada con éxito", result });
    } catch (error) {
      res.status(500).json({ msg: "Error al eliminar película", error: error.message });
    }
  }
}


// #########################################################
//                      Categorías
// #########################################################
export class AdminCategoryController {
  static async add(req, res) {
    try {
        // inicia la categoria
      await adminCategories.init();
      // llama la funcion de añadir categoria , y recibe la informacion del body
      const result = await adminCategories.addCategory(req.body);

      // si todo va bien, devuelve el resultado, sino , lanza error
      res.status(201).json({ msg: "Categoría agregada con éxito", result });
    } catch (error) {
      res.status(500).json({ msg: "Error al agregar categoría", error: error.message });
    }
  }

  static async update(req, res) {
    try {
        // inicia el modelo 
      await adminCategories.init();
      // recibe el id de los parametros
      const { id_genero } = req.params; 
      // Llama a la funcion de actualizar categoria y recibe los datos del body
      const result = await adminCategories.UpdateCategory(req.body, parseInt(id_genero));

      // si todo va bien , devuelve el resultado, sino , lanza error
      res.json({ msg: "Categoría actualizada con éxito", result });
    } catch (error) {
      res.status(500).json({ msg: "Error al actualizar categoría", error: error.message });
    }
  }

  static async delete(req, res) {
    try {
        // inicia el modelo 
      await adminCategories.init();
      // recibe el id de los parametros
      const { id_genero } = req.params; 
      // llama la funcion de eliminar categoria, y como el id es un int, vuelve el id
      // que recibe en entero para poder eliminarlo 
      const result = await adminCategories.deleteCategory(parseInt(id_genero));

      // si todo va bien , devuelve el resultado, sino, lanza error
      res.json({ msg: "Categoría eliminada con éxito", result });
    } catch (error) {
      res.status(500).json({ msg: "Error al eliminar categoría", error: error.message });
    }
  }
}
