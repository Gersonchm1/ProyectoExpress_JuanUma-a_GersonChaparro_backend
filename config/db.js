import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let client;

async function connectDB() {
    // si el cliente no existe o esta definido , inica el proceso
  if (!client) {
    client = new MongoClient(process.env.URI, {
      maxPoolSize: 10,  // máximo número de conexiones 
      minPoolSize: 2,   // número mínimo de conexiones que siempre estarán abiertas
      serverSelectionTimeoutMS: 5000 // tiempo máximo de espera para seleccionar un servidor
    });

    // cuando el cliente se conecta da un mensaje
    await client.connect();
    console.log("✅ Conectado a MongoDB con pool de conexiones");
  }

  return client.db(process.env.DB_NAME);
}

export default connectDB;
export { client };
