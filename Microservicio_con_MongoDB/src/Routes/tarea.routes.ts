import express from "express";
import { crearTarea, obtenerTareas, obtenerTareaPorId, actualizarTareaCompleta } from "../Controllers/tarea.controller.js";

const router = express.Router();
router.post("/tasks", crearTarea);
router.get("/tasks", obtenerTareas);
router.get("/tasks/:id", obtenerTareaPorId);
router.put("/tasks/:id", actualizarTareaCompleta);

export default router;