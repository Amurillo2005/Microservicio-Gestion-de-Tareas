import type { Response, Request } from "express";
import { TareaService } from "../Services/tarea.service.js";

export const crearTarea = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, status, assignedTo, dueDate } = req.body;
        const tareaService = new TareaService();
        const tarea = await tareaService.crearTarea({ title, description, status, assignedTo, dueDate } as any);
        res.status(201).json(tarea);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la tarea" });
    }
}

export const obtenerTareas = async (req: Request, res: Response): Promise<void> => {
    try {
        const tareaService = new TareaService();
        const tareas = await tareaService.obtenerTareas();
        res.status(200).json(tareas);
    } catch (error: any) {
        if (error.message === "No se encontraron tareas") {
            res.status(404).json({
                message: "No se encontraron tareas"
            });
            return;
        }
        res.status(500).json({ error: "Error al obtener las tareas" });
    }
}