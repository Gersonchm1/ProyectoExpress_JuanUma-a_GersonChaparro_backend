// app.js
import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
// Configuración
dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Servir la carpeta public
app.use(express.static(path.join(__dirname, "public")));




app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json()); 

// Passport
import "./config/passport.js"; // inicializa estrategia JWT
app.use(passport.initialize());

// Rate limiter global (ejemplo: 100 requests / 15 min por IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Demasiadas solicitudes desde esta IP, inténtalo más tarde.",
});
app.use(limiter);

// Rutas
import userRoutes from "./routes/userRoutes.js";

// Usamos prefijos
app.use("/api/users", userRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ msg: "Bienvenido a la API de películas con Passport + JWT 🚀" });
});

// Puerto
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
