// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000", // ton backend
});

// --- CRUD Projets ---
export const getProjects = () => API.get("/projects");
export const createProject = (project) => API.post("/projects", project);
export const updateProject = (id, project) => API.put(`/projects/${id}`, project);
export const deleteProject = (id) => API.delete(`/projects/${id}`);



