import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { addVersion } from "./middleware/version.js";

// Configuración
dotenv.config();
const app = express();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Servir la carpeta public
app.use(express.static(path.join(dirname, "public")));

// Configuración CORS
app.use(cors({
  origin: "http://localhost:3000/", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Parseo de JSON
app.use(express.json());
// añade la version en las respuestas 
app.use(addVersion);

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
import userRoutes from "./routes/userRoute.js";
import adminRoutes from "./routes/adminRoute.js"; // Rutas de admin

// Prefijos de rutas
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes); // Rutas de admin (películas y categorías)

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ msg: "Bienvenido a la API de películas con Passport + JWT 🚀" });
});

// Puerto
const PORT = process.env.PORT;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
