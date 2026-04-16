import express from "express";
import { crearTarea, obtenerTareas, obtenerTareaPorId, actualizarTareaCompleta, actualizarTareaParcial, eliminarTarea, obtenerTareaPorEstado, programarTrabajoAsincrono} from "../Controllers/tareaController.js";

const router = express.Router();

router.post("/tasks", crearTarea);
router.get("/tasks", obtenerTareas);
router.get("/tasks/:id", obtenerTareaPorId);
router.put("/tasks/:id", actualizarTareaCompleta);
router.patch("/tasks/:id", actualizarTareaParcial);
router.delete("/tasks/:id", eliminarTarea);
router.get("/tasks/status/:status", obtenerTareaPorEstado);
router.post("/tasks/:id/schedule", programarTrabajoAsincrono);

export default router;