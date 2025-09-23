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
}


export  class UserModelRegister {
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

  
   // Login de usuario con bcrypt
   
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

    // Buscar usuario por ID 
    async findUserById(userId) {
      const db = await connectDB();
      const session = db.client.startSession();
  
      try {
        let user;

        // Busca el usuario en la coleccion por su id 
        await session.withTransaction(async () => {
          user = await db.collection(this.collection).findOne(
            { _id: new ObjectId(userId) },
            { session }
          );
        });
        return user;
      } catch (error) {
        console.error("Error en findUserById:", error);
        throw error;
      } finally {
        await session.endSession();
      }
    }
  
  
}


