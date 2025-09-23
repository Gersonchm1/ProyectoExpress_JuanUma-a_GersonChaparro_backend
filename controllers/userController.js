import { client } from "../config/db.js";
import { UserModelRegister } from "../models/userModel.js";

const userModel = new UserModelRegister();

export class  UserController {
  // Registrar usuario
  static async register(req, res) {
    const session = client.startSession();
    try {
      const result = await userModel.register(req.body, session);
      res.status(201).json({
        msg: "Usuario registrado con éxito",
        id: result.insertedId,
      });
    } catch (error) {
      res.status(500).json({ msg: "Error al registrar usuario", error: error.message });
    } finally {
      await session.endSession();
    }
  }

  // Login usando el modelo que ya tienes
  static async login(req, res) {
    try {
      const { email, contrasena } = req.body;

      // tu modelo maneja la validación y genera token
      const data = await userModel.login(email, contrasena);
      if (!data) return res.status(401).json({ msg: "Credenciales inválidas" });

      // Respuesta según rol
      if (data.uuario.tipo === "admin") {
        return res.json({
          msg: "Bienvenido administrador",
          token: data[`bearer`].token ,
          user: { id: data.user._id, email: data.user.email },
        });
      }

      res.json({
        msg: "Bienvenido usuario",
        token: data.token,
        user: { id: data.user._id, email: data.user.email },
      });
    } catch (error) {
      res.status(500).json({ msg: "Error al iniciar sesión", error: error.message });
    }
  }
}

