import { client } from "../config/db.js";
import { UserModelRegister } from "../models/userModel.js";


const userModel = new UserModelRegister();

export class  UserController {
  // Registrar usuario
  static async register(req, res) {
    const session = client.startSession();
    try {
      const { nombre, correo, contrasena } = req.body;
  
      const result = await userModel.registerUser({
        name: nombre,       
        email: correo,      
        password: contrasena 
      }, session);
  
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

      const mensaje = data.user.role === "admin" 
      ? "Bienvenido administrador" 
      : `Bienvenido ${data.user.name}`;
      
      res.json({
        msg: `Bienvenido ${data.user.role === "admin" ? "administrador" : "usuario"}`,
        user: data.user,
        token: `Bearer ${data.token}`
      });
    } catch (error) {
      res.status(500).json({ msg: "Error al iniciar sesión", error: error.message });
    }
  }
}
