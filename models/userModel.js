
import connectDB from "../config/db.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export default class UserModelMovie {
  constructor() {
    this.collection = null;


}

// Inicializa la colección
async init() {
  const db = await connectDB();
  this.collection = db.collection("usuario"); // Nombre de la colección
}


// Buscar usuario por email
async findUserbyEmail(correo) {
  return await this.collection.findOne({ correo });
}

// Buscar usuario por id
async viewMovie() {
  return await this.collection.find();
}




}