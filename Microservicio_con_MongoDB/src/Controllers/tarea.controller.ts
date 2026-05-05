import type { Response, Request } from "express";
import { TareaService } from "../Services/tarea.service.js";

export const crearTarea = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, status, assignedTo, dueDate } = req.body;
        const tareaService = new TareaService();
        const tarea = await tareaService.crearTarea({ title, description, status, assignedTo, dueDate } as any);
        res.status(201).json(tarea);
    } catch (error: any) {
        if (error.message === "Campos incompletos") {
            res.status(400).json({
                message: "Campos incompletos"
            });
            return;
        }
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

export const obtenerTareaPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const tareaService = new TareaService();
        const tareas = await tareaService.obtenerTareaPorId(id as string);
        res.status(200).json(tareas);
    } catch (error: any) {

        if (error.message === "No se encontró el id de esta tarea") {
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
        const tarea = await tareaService.actualizarTareaCompleta( id as string, { title, description, status, assignedTo, dueDate } as any);
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
        res.status(500).json({ message: "Error al actualizar la tarea" });
    }
}

export const actualizarTareaParcial = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, status, assignedTo, dueDate } = req.body;
        const tareaService = new TareaService();
        const tarea = await tareaService.actualizarTareaParcial(id as string, { title, description, status, assignedTo, dueDate });
        res.status(200).json(tarea);
    } catch (error: any) {
        if (error.message === "No se encontró el id de esta tarea") {
            res.status(404).json({
                message: "Tarea no encontrada"
            });
            return;
        }
        res.status(500).json({ message: "Error al actualizar la tarea" });
    }
}

export const eliminarTarea = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const tareaService = new TareaService();
        const tarea = await tareaService.eliminarTarea(id as string);
        res.status(200).json({
            message: "Tarea eliminada correctamente",
            tarea
        })
    } catch (error: any) {
        if (error.message === "No se encontró el id de esta tarea") {
            res.status(404).json({
                message: "Tarea no encontrada"
            });
            return;
        }
        res.status(500).json({ message: "Error al eliminar la tarea" });
    }
}

export const obtenerTareasPorStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.params;
        const tareaService = new TareaService();
        const tareas = await tareaService.obtenerTareasPorStatus(status as string);
        res.status(200).json(tareas);
    } catch (error: any) {
        if (error.message === "No se encontraron tareas con este status") {
            res.status(404).json({
                message: "No se encontraron tareas con este status"
            });
            return;
        }
        res.status(500).json({ message: "Error al obtener las tareas" });
    }
}

export const programarTrabajoAsincrono = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const tareaService = new TareaService();
        await tareaService.programarTrabajoAsincrono(id as string);
        res.status(200).json({ message: "Trabajo programado correctamente" });
    } catch (error: any) {
        if (error.message === "No se encontró el id de esta tarea") {
            res.status(404).json({
                message: "Tarea no encontrada"
            });
            return;
        }
        if (error.message === "La tarea no tiene fecha de vencimiento") {
            res.status(400).json({
                message: "La tarea no tiene fecha de vencimiento"
            });
            return;
        }
        if (error.message === "Este trabajo ya ha sido programado") {
            res.status(400).json({
                message: "Este trabajo ya ha sido programado"
            });
            return;
        }
        if (error.message === "La tarea ya ha vencido") {
            res.status(400).json({
                message: "La tarea ya ha vencido"
            });
            return;
        }
        res.status(500).json({ message: "Error al programar el trabajo" });
    }
}