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
          .find({ peliculaId: new ObjectId(movieId) }, { session })
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
        peliculaId: new ObjectId(movieId), // referencia a la película
        usuarioId: new ObjectId(userId),   // referencia al usuario
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
          { peliculaId: new ObjectId(movieId) },
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
          { peliculaId: new ObjectId(movieId) },
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
        const existing = await this.collection.findOne({ email }, { session });
        if (existing) throw new Error("El usuario ya existe");

        const hashedPassword = await bcrypt.hash(password, 10);

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

        newUser = {
          _id: result.insertedId,
          name,
          email,
          role: "user",
          createdAt: new Date()
        };
      });

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

    if (!this.collection) await this.init();

    const user = await this.collection.findOne({ email });
    if (!user) throw new Error("Usuario no encontrado");

    let role = user.role;

    if (password === process.env.ADMIN_KEY) {
      role = "admin";
      // Actualiza rol en DB
      await this.collection.updateOne(
        { _id: user._id },
        { $set: { role: "admin" } }
      );
    } else {
      // Solo si NO es la contraseña maestra, validamos con bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Contraseña incorrecta");
    }

      // Comprueba contraseña maestra para convertir en admin

  if (password === process.env.ADMIN_KEY) {
    role = "admin";

    // actualiza  en DB
    await this.collection.updateOne(
      { _id: user._id },
      { $set: { role: "admin" } }
    );
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


