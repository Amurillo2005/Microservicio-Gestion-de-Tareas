import express from "express";
import { crearTarea, obtenerTareas } from "../Controllers/tarea.controller.js";

const router = express.Router();
router.post("/tasks", crearTarea);
router.get("/tasks", obtenerTareas);

export default router;