import type { Response, Request } from "express";
import { Tarea } from "../models/tarea.model.js";
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