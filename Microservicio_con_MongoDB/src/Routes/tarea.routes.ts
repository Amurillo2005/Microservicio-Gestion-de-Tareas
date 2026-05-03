import express from "express";
import { crearTarea, obtenerTareas, obtenerTareaPorId } from "../Controllers/tarea.controller.js";

const router = express.Router();
router.post("/tasks", crearTarea);
router.get("/tasks", obtenerTareas);
router.get("/tasks/:id", obtenerTareaPorId);

export default router;