import { session } from "passport";
import connectDB, { client } from "../config/db.js";
import { ObjectId } from "mongodb";


// #######################################################################################

//                                   Clase peliculas Admin

// #######################################################################################

export class AdminModelMovies {

constructor() {
    this.collection = null 
}

// inicializamos la base de datos 
async init() {
    const db = connectDB();
    this.collection = db.collection("pelicula")
}

// Añadir peliculas
async addMovies(data ){

    // Iniciamos la sesion 
const session = client.startSession()
try {

    let  result
// iniciamos la transaccion
 await session.withTransaction(async () => {

    // Guardamos los datos

    const newMovie = {
        ...data,
        id: new ObjectId(),
        fecha: new Date()

    }
// insertamos la data en la coleccion
 result = await this.collection.insertOne(newMovie, {session})



 });

 // devolvemos la respueta y si hay error, lanza error
   return result;
  } catch (err) {
    console.error("Error en transacción:", err);
    throw err;
  } finally {
    await session.endSession();
  }
}


async UpdateMovie(data, movieId ) {
  const session = client.startSession();
  try {
    let result;

    // iniciamos la transaccion 
    await session.withTransaction(async () => {
      // Construir la reseña con IDs controlados en el backend
      const updateMovieData = {
        ...data,
        id_pelicula: new ObjectId(movieId),
        fecha: new Date()
      };

      // Insertar o actualizar (si ya existe una reseña del mismo usuario para esa película)
      result = await this.collection.updateOne(
        {
          id_pelicula: new ObjectId(movieId),
        },
        
    // actualiza la informacion necesaria

        { $set: updateMovieData },

    // si el documento existe, lo actualiza, sino , lo crea
        { upsert: true, session }
      );
    });

    return result;
  } finally {
    await session.endSession();
  }
}

 async  deleteComments(movieId) {
    const session = client.startSession();
    try {
      let total;
      // iniciamos la transaccion
      await session.withTransaction(async () => {
        // Aqui, elimina de la coleccion las peliculas, por su id
        // y crea la sesion
        total = await this.collection.deleteOne(
          { id_pelicula: new ObjectId(movieId) },
          { session }
        );
      });
      // devuelve la data
      return total;
    } finally {
      await session.endSession();
    }
  }
}


// #############################################################################################

//                                     Categoria

//##############################################################################################



export class AdminModelMovies {

constructor() {
    this.collection = null 
}

// inicializamos la base de datos 
async init() {
    const db = connectDB();
    this.collection = db.collection("genero")
}

// Añadir Categoria
async addCategory(data){

    // Iniciamos la sesion 
const session = client.startSession()
try {

    let  result
// iniciamos la transaccion
 await session.withTransaction(async () => {

    // Guardamos los datos

    const newCategory = {
        ...data,
        id: new ObjectId(),
        fecha: new Date()

    }
// insertamos la data en la coleccion
 result = await this.collection.insertOne(newCategory, {session})



 });

 // devolvemos la respueta y si hay error, lanza error
   return result;
  } catch (err) {
    console.error("Error en transacción:", err);
    throw err;
  } finally {
    await session.endSession();
  }
}


async UpdateCategory(data, categoryId ) {
  const session = client.startSession();
  try {
    let result;

    // iniciamos la transaccion 
    await session.withTransaction(async () => {
      // se ponen los datos a cambiar
      const updateMovieData = {
        ...data,
        id_pelicula: new ObjectId(categoryId),
        fecha: new Date()
      };

      // Insertar o actualizar 
      result = await this.collection.updateOne(
        {
          id_pelicula: new ObjectId(movieId),
        },
        
    // actualiza la informacion necesaria

        { $set: updateMovieData },

    // si el documento existe, lo actualiza, sino , lo crea
        { upsert: true, session }
      );
    });

    // devuelve la info
    return result;
  } finally {
    await session.endSession();
  }
}

 async  deleteCategory(categoryId) {
    const session = client.startSession();
    try {
      let total;
      // iniciamos la transaccion
      await session.withTransaction(async () => {
        // Aqui, elimina de la coleccion las categoria, por su id
        // y crea la sesion
        total = await this.collection.deleteOne(
          { id_pelicula: new ObjectId(categoryId) },
          { session }
        );
      });
      // devuelve la data
      return total;
    } finally {
      await session.endSession();
    }
  }
}



