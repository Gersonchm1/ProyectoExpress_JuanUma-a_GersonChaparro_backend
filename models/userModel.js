import connectDB, { client } from "../config/db.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



export class UserModelMovie {
  constructor() {
    this.collection = null;
  }

  async init() {
    const db = await connectDB();
    this.collection = db.collection("pelicula");
  }


  // Ver todas las películas
  async viewMovie() {
    // Iniciamos la sesion
    const session = client.startSession();
    try {
      let result;
      // Iniciamos la transaccion y hacemos los procesos
      await session.withTransaction(async () => {
        result = await this.collection.find({}, { session }).toArray();
      });
      // devolvemos el resultado
      return result;
    } finally {
      await session.endSession();
    }
  }
  // Ve las primeras 20 películas más vistas
async topMoviesByViews(limit = 20) {
  const session = client.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await this.collection
        .find({}, { session })        // todas las películas
        .sort({ Vistas: -1 })     // ordena las peliculas de mayor a menor 
        .limit(limit)                 // limita  las peliculas a las  20 primeras
        .toArray();
    });
    return result;
  } finally {
    await session.endSession();
  }
}
// Aumenta las vistas con el id de la ppelicula
async incrementViews(movieId) {
  const session = client.startSession();
  try {
    let result;

    await session.withTransaction(async () => {

      // Actualiza en la coleccion la parte de vistas
      result = await this.collection.updateOne(
        { _id: new ObjectId(movieId) },
        { $inc: { Vistas: 1 } }, // suma +1 al campo Vistas
        { session }
      );
    });

    //devuelve la información actualizada
    return result;
  } finally {
    await session.endSession();
  }
}


}

export class UserModelComments {
  constructor() {
    this.collection = null;
  }

  async init() {
    const db = await connectDB();
    this.collection = db.collection("comentario");
  }

  // Ver todos los comentarios
  async viewComment() {
    const session = client.startSession();
    try {
      let result;
      await session.withTransaction(async () => {
        // busca todos los comentarios en la db
        result = await this.collection.find({}, { session }).toArray();
      });
      return result;
    } finally {
      await session.endSession();
    }
  }

  // Ver comentarios de una película
  async viewCommentByMovie(movieId) {
    const session = client.startSession();
    try {
      let result;
      await session.withTransaction(async () => {
        result = await this.collection
        // encuentra la pelicula por el id que recibe
          .find({ id_pelicula: new ObjectId(movieId) }, { session })
          .toArray();
      });
      return result;
    } finally {
      await session.endSession();
    }
  }

 // Añadir comentario ligado a una película y aumentar contador
async addComment(data, movieId, userId) {
  const session = client.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      const newComment = {
        ...data,
        id_pelicula: new ObjectId(movieId), // referencia a la película
        id_usuario: new ObjectId(userId),   // referencia al usuario
        fecha: new Date(),
      };

      // Insertar el comentario en la colección "comentario"
      result = await this.collection.insertOne(newComment, { session });

      // Actualiza el total de comentarios en la colección "pelicula"
      const db = await connectDB();
      await db.collection("pelicula").updateOne(
        // obtiene el object id ,  crea y si existe, aumenta un campo llamado, total comentarios
        { _id: new ObjectId(movieId) },
        { $inc: { totalComentarios: 1 } }, // aumenta en 1
        { session }
      );
    });
    return result;
  } catch (err) {
    console.error("Error en transacción:", err);
    throw err;
  } finally {
    await session.endSession();
  }
}


  // Contar comentarios por película
  async countCommentsByMovie(movieId) {
    const session = client.startSession();
    try {
      let total;
      await session.withTransaction(async () => {
        // Aqui cuenta la cantidad de documentos que hay en mongo db, osea comentarios
        total = await this.collection.countDocuments(
          { id_pelicula: new ObjectId(movieId) },
          { session }
        );
      });
      return total;
    } finally {
      await session.endSession();
    }
  }

   async  deleteComments(movieId) {
    const session = client.startSession();
    try {
      let total;
      await session.withTransaction(async () => {
        // Aqui, elimina de la coleccion los cmentarios con el id de la pelicula ingresado 
        // y crea la sesion
        total = await this.collection.deleteOne(
          { id_pelicula: new ObjectId(movieId) },
          { session }
        );
      });
      return total;
    } finally {
      await session.endSession();
    }
  }

 // Dentro de tu modelo de reseñas
async UpdateComments(data, movieId, userId) {
  const session = client.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      // Construir la reseña con IDs controlados en el backend
      const reviewData = {
        ...data,
        id_usuario: new ObjectId(userId),
        id_pelicula: new ObjectId(movieId),
        fecha: new Date()
      };

      // Insertar o actualizar (si ya existe una reseña del mismo usuario para esa película)
      result = await this.collection.updateOne(
        {
          id_usuario: new ObjectId(userId),
          id_pelicula: new ObjectId(movieId),
        },
        { $set: reviewData },
        { upsert: true, session }
      );
    });

    return result;
  } finally {
    await session.endSession();
  }
}
}

export class UserModelRatings{ 
    constructor() {
    this.collection = null;
  }

  // Inicializa la colección
  async init() {
    const db = await connectDB();
    this.collection = db.collection("calificacion");
  }

async  addRating(data, movieId, userId) {
    const session = client.startSession();
    try {
      let total;
      await session.withTransaction(async () => {

              const newRating = {
        ...data,
       id_pelicula: new ObjectId(movieId), 
       id_usuario: new ObjectId(userId),   
        fecha: new Date(),
      };
       
        // Añaddimos el nuevo rating y la informacion
    const db = await connectDB();
      await db.this.collection.updateOne(
        // obtiene el object id ,  crea y si existe, aumenta un campo llamado, total comentarios
        { _id: new ObjectId(movieId) },
        { $inc: { totalratings: 1 } }, // aumenta en 1
        { session }
      );
    });
      return total;
    } finally {
      await session.endSession();
    }
  }

  async viewRating() {

    
    const session = client.startSession();
    try {
      let result;
      await session.withTransaction(async () => {
        result = await this.collection.find({}, { session }).toArray();
      });
      return result;
    } finally {
      await session.endSession();
    }
  }
  // Funcion para ver las 20 peliculas mejor calificadas
  async topRatedMovies(limit = 20) {
  const session = client.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      // se hace una agragacion
      result = await this.collection.aggregate([
        {
          // Se agrupan las calificaciones
          $group: {
            // se agrupan por plicula
            _id: "$id_pelicula",
            // crea un array con los valores de rating de la pelicula
            ratings: { $push: "$rating" },
            // saca un promedio de los ratings
            avgRating: { $avg: "$rating" }
          }
        },
        {
          // Extrae los datos de la pelicula, da el id actual y referencia el id de peliculas
          $lookup: {
            from: "pelicula",
            localField: "_id",
            foreignField: "_id",
            as: "pelicula"
          }
        },
        // se deshace el array pelicula 
        { $unwind: "$pelicula" },
        // devolvemos las primeras 20 peliculas mejor calificadas
        { $sort: { avgRating: -1 } },
        { $limit: limit }
      ], { session }).toArray();
    });
    return result;
  } finally {
    await session.endSession();
  }
}
}




export class UserModelRegister {
  constructor() {
    this.collection = null;
  }

  async init() {
    const db = await connectDB();
    this.collection = db.collection("usuario");
  }

  // Registrar usuario
  async registerUser({ name, email, password, role = "user" }) {
    await this.init(); // inicializar colección

    const session = client.startSession();

    try {
      let newUser;
      await session.withTransaction(async () => {
        // Revisamos si el usuario existe o no
        const existing = await this.collection.findOne({ email }, { session });
        if (existing) throw new Error("El usuario ya existe");

        // Hasheamos la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertamos los valores que se reciben y el rol es usuario por defecto
        const result = await this.collection.insertOne(
          {
            name,
            email,
            password: hashedPassword,
            role:"user",
            createdAt: new Date(),
          },
          { session }
        );

        //Se registra la informacion en una variable
        newUser = {
          _id: result.insertedId,
          name,
          email,
          role: "user",
          createdAt: new Date()
        };
      });
// Se devuelve la informacion
      return newUser;
    } catch (err) {
      throw new Error("Error en registro: " + err.message);
    } finally {
      await session.endSession();
    }
  }

  // Login
  async loginUser({ email, password }) {
    await this.init(); // inicializar colección


    // Busca el usuario por el email , si no lo encuentra  sale error
    const user = await this.collection.findOne({ email });
    if (!user) throw new Error("Usuario no encontrado");

    // definimos role
    let role = user.role;
// revisa la contraseña que se puso si es la que esta en .env
    if (password === process.env.ADMIN_KEY) {
      role = "admin";
      // Si la contraseña coincide con la de ADMIN_KEY, actualiza rol en DB
      await this.collection.updateOne(
        { _id: user._id },
        { $set: { role: "admin" } }
      );
    } else {
      // Solo si NO es la contraseña maestra, validamos con bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Contraseña incorrecta");
    }


      // Genera token JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );

    // Retorna usuario y token juntos
    return {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token
    };
  }
  // Buscar usuario por ID
  async findUserById(userId) {
    if (!this.collection) await this.init();
    return await this.collection.findOne({ _id: new ObjectId(userId) });
  }
}