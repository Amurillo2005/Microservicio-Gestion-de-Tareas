import type { Request, Response } from "express";
import { TareaService } from "../Services/tarea.service.js";


export const crearTarea = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, status, assignedTo, dueDate } = req.body;
        const tareaService = new TareaService();
        const tarea = await tareaService.crearTarea({ title, description, status, assignedTo, dueDate });
        res.status(201).json(tarea)
    } catch (error: any) {
        console.error("Error al crear la tarea: ", error);
        res.status(500).json({ message: "Error al crear la tarea" });
    }
}

export const obtenerTareas = async (req: Request, res: Response): Promise<void> => {
    try {
        const tareaService = new TareaService();
        const tareas = await tareaService.obtenerTodasLasTareas();
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

export const obtenerTareaPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const tareaService = new TareaService();
        const tareas = await tareaService.obtenerTareasPorId(Number(id));
        res.status(200).json(tareas);
    } catch (error: any) {
        if (error.message === "Tarea no encontrada") {
            res.status(404).json({
                message: "Tarea no encontrada"
            });
            return;
        }
        res.status(500).json({ error: "Error al obtener la tarea" });
    }
}

export const actualizarTareaCompleta = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, status, assignedTo, dueDate } = req.body;
        const tareaService = new TareaService();
        const tarea = await tareaService.actualizarTareaCompleta(Number(id), { title, description, status, assignedTo, dueDate });
        res.status(200).json(tarea);
    } catch (error: any) {
        if (error.message === "No se encontró el id de esta tarea") {
            res.status(404).json({
                message: "Tarea no encontrada"
            });
            return;
        }

        if (error.message === "Todos los campos son obligatorios") {
            res.status(400).json({
                message: "Todos los campos son obligatorios"
            });
            return;
        }
        res.status(500).json({ error: "Error al actualizar la tarea" });
    }
}

export const actualizarTareaParcial = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, status, assignedTo, dueDate } = req.body;
        const tareaService = new TareaService();
        const tarea = await tareaService.actualizarTareaParcial(Number(id), { title, description, status, assignedTo, dueDate });
        res.status(200).json(tarea);
    } catch (error: any) {
        if (error.message === "No se encontró el id de esta tarea"){
            res.status(404).json({
                message: "Tarea no encontrada"
            })
        }

        res.status(500).json({ error: "Error al actualizar la tarea" });
    }
}

export const eliminarTarea = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const tareaService = new TareaService();
        const tarea = await tareaService.eliminarTarea(Number(id));
        res.status(200).json(tarea)
    } catch (error: any) {
        if (error.message === "No se encontró el id de esta tarea") {
            res.status(404).json({
                message: "Tarea no encontrada"
            });
            return;
        }
        res.status(500).json({ error: "Error al eliminar la tarea" });
    }
}

export const obtenerTareaPorEstado = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.params;
        const tareaService = new TareaService();
        const tareas = await tareaService.obtenerTareaPorEstado(status as string);
        res.status(200).json(tareas);
    } catch (error: any) {
        res.status(500).json({ error: "Error al obtener las tareas por estado" });
    }
}