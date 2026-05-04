import express from "express";
import { crearTarea, obtenerTareas, obtenerTareaPorId, actualizarTareaCompleta, actualizarTareaParcial } from "../Controllers/tarea.controller.js";

const router = express.Router();
router.post("/tasks", crearTarea);
router.get("/tasks", obtenerTareas);
router.get("/tasks/:id", obtenerTareaPorId);
router.put("/tasks/:id", actualizarTareaCompleta);
router.patch("/tasks/:id", actualizarTareaParcial);
export default router;