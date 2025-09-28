import connectDB, { client } from "../config/db.js";


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

async addMovies(data) {
  const session = client.startSession();
  try {
    let result;
    // iniciamos la transaccion
    await session.withTransaction(async () => {
      // Obtenemos la última película para generar el nuevo ID llamando a la coleccion
      const lastMovie = await this.collection
        .find({})
        .sort({ _id: -1 }) // ordenamos por _id descendente
        .limit(1)
        .toArray();

      let newId;
      // revisamos que existan por lo menos peliculas
      if (lastMovie.length > 0) {
        // Si ya hay películas, extraemos el número del último ID
        const lastId = lastMovie[0]._id;

        // Con replaace le quitamos la parte de MOVX, y lo demas lo dejamos, luego a ese numero
        // lo volvemos int y le sumamos 1
        const num = parseInt(lastId.replace("MOVX", "")) + 1;

        // Luego , añadimos el MOVX, el numero , lo volvemos string, y 
        // con padstart, hacemos que todo se rellene de ceros
        // hasta que haya un numero, ejemplo 008 , 040
        newId = `MOVX${num.toString().padStart(3, "0")}`;
      } else {
        // Si no hay películas aún, se empieza desde MOVX001
        newId = "MOVX001";
      }

      // se crea la nueva película con ID string
      const newMovie = {
        ...data,
        id: newId,
        fecha: new Date(),
      };
      // se inserta la nueva pelicula con la informacion

      result = await this.collection.insertOne(newMovie, { session });
    });

    // se devuelve la respuesta
    return result;
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
        _id: movieId,
        fecha: new Date()
      };

      // Insertar o actualizar (si ya existe una reseña del mismo usuario para esa película)
      result = await this.collection.updateOne(
        {
          _id: movieId,
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
 async deleteMovie(movieId) {
  const session = client.startSession();
  try {
    let result;
    // iniciamos la transacción
    await session.withTransaction(async () => {
      // Eliminamos la película de la colección por su _id
      result = await this.collection.deleteOne(
        { _id: movieId },  // Busca el _id = "MOVX001", "MOVX002", etc.
        { session }
      );
    });

    // devolvemos el resultado de la operación
    return result;
  } finally {
    await session.endSession();
  }
}
}


// #############################################################################################

//                                     Categoria

//##############################################################################################



export class AdminModelCategory {

constructor() {
    this.collection = null 
}

// inicializamos la base de datos 
async init() {
    const db = connectDB();
    this.collection = db.collection("genero")
}

// Añadir Categoria
async addCategory(data) {

  // Iniciamos la sesion 
  const session = client.startSession()
  try {

    let result
    // iniciamos la transaccion
    await session.withTransaction(async () => {

      // Obtenemos la última categoría para generar el nuevo id_genero
      const lastCategory = await this.collection
        .find({})
        .sort({ id_genero: -1 }) // ordenamos por id_genero descendente
        .limit(1)
        .toArray();

      let newId;
      // revisamos que existan por lo menos categorías
      if (lastCategory.length > 0) {
        // Si ya hay categorías, extraemos el último id_genero y le sumamos 1
        newId = lastCategory[0].id_genero + 1;
      } else {
        // Si no hay categorías aún, se empieza desde 1
        newId = 1;
      }

      // Guardamos los datos
      const newCategory = {
        ...data,
        id_genero: newId, 
        fecha: new Date()
      }

      // insertamos la data en la coleccion
      result = await this.collection.insertOne(newCategory, { session })

    });

    // devolvemos el resultado
    return result;
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
        _id: categoryId,
        fecha: new Date()
      };

      // Insertar o actualizar 
      result = await this.collection.updateOne(
        {
          _id: movieId,
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
          { _id: categoryId },
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



