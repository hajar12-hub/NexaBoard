import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Exemple route protégée
router.get("/", protect, authorizeRoles("manager", "admin"), (req, res) => {
  res.json({ message: "Liste des projets accessibles" });
});

// Exemple : route accessible à tous utilisateurs connectés
router.post("/", protect, (req, res) => {
  res.json({ message: "Projet créé par un utilisateur connecté" });
});

export default router;
