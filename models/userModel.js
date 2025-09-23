import connectDB, { client } from "../config/db.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";


export class UserModelMovie {
  constructor() {
    this.collection = null;
  }

  async init() {
    const db = await connectDB();
    this.collection = db.collection("pelicula");
  }

  // Buscar película por ID
  async findMovieById(movieId) {
    const session = client.startSession();
    try {
      let result;
      await session.withTransaction(async () => {
        result = await this.collection.findOne(
          { _id: new ObjectId(movieId) },
          { session }
        );
      });
      return result;
    } finally {
      await session.endSession();
    }
  }

  // Ver todas las películas
  async viewMovie() {
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

  // Añadir comentario ligado a una película
  async addComment(data, movieId, userId) {
    const session = client.startSession();
    try {
      let result;
      await session.withTransaction(async () => {
        const newComment = {
          ...data,
          peliculaId: new ObjectId(movieId),
          usuarioId: new ObjectId(userId),
          fecha: new Date(),
        };

        result = await this.collection.insertOne(newComment, { session });
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
}


export default class UserModelRegister {
  constructor() {
    this.collection = null;
  }

  // Inicializa la colección
  async init() {
    const db = await connectDB();
    this.collection = db.collection("usuario");
  }

// Registrar usuario
  async registerUser({ name, email, password, role = "user" }) {
    const client = await connectDB().then(db => db.client); // obtener el cliente para la sesión
    const session = client.startSession();

    try {
      let newUser;
      await session.withTransaction(async () => {
        // Verificar si ya existe
        const existing = await this.collection.findOne({ email }, { session });
        if (existing) {
          throw new Error("El usuario ya existe");
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar usuario
        const result = await this.collection.insertOne(
          {
            name,
            email,
            password: hashedPassword,
            role, // por defecto "user"
            createdAt: new Date(),
          },
          { session }
        );

        newUser = {
          _id: result.insertedId,
          name,
          email,
          role,
        };
      });

      return newUser;
    } catch (err) {
      throw new Error("Error en registro: " + err.message);
    } finally {
      await session.endSession();
    }
  }

  /**
   * Login de usuario con bcrypt
   */
  async loginUser({ email, password }) {
    try {
      const user = await this.collection.findOne({ email });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // Comparar contraseñas
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Contraseña incorrecta");
      }

      // Retornar datos básicos (sin password)
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
    } catch (err) {
      throw new Error("Error en login: " + err.message);
    }
  }
}
