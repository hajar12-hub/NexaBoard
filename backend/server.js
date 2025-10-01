import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js"; // attention au chemin
import authRoutes from "./src/routes/auth.js";
import projectRoutes from "./src/routes/project.js";



dotenv.config();
dotenv.config(); // pour charger les variables d'envronnemnt depuis le fichier .env(garder les inf sensibles)
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);


app.get('/', (req, res) => {
  res.send("Hello World it's me Hazaaar! Backend is running...");
});


//lancer serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});



