import { Request, Response } from "express";
import { TareaService } from "../Services/tarea.service";
import { Status } from "../generated/prisma/enums";

export const crearTarea = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, status, assignedTo, dueDate } = req.body;
        const tareaService = new TareaService();
        const tarea = await tareaService.crearTarea({ title, description, status, assignedTo, dueDate });
        res.status(201).json(tarea);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            error: "Error al crear la tarea",
            detalle: {
                error
            }
        });
    }
}

export const obtenerTareas = async (req: Request, res: Response): Promise<void> => {
    try {
        const tareasService = new TareaService();
        const tareas = await tareasService.obtenerTodasLasTareas();
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
        const tareas = await tareaService.obtenerTareasPorId(id as string);
        res.status(200).json(tareas);
    } catch (error: any) {
        if (error.message === "Tarea no encontrada") {
            res.status(404).json({
                message: "Tarea no encontrada"
            });
            return;
        }

        if (error.message === "No se encontró el id de esta tarea") {
            res.status(400).json({
                message: "El id es requerido"
            });
            return;
        }

        res.status(500).json({
            error: "Error al obtener la tarea"
        });
    }
}

export const actualizarTareaCompleta = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, status, assignedTo, dueDate } = req.body;
        const tareaService = new TareaService();
        const tarea = await tareaService.actualizarTareaCompleta(id as string, { title, description, status, assignedTo, dueDate });
        res.status(200).json(tarea);
    } catch (error: any) {
        if (error.message === "No se encontró el id de esta tarea") {
            res.status(400).json({
                message: "El id es requerido"
            });
            return;
        }

        if (error.message === "Todos los campos son obligatorios") {
            res.status(400).json({
                message: "Todos los campos son obligatorios"
            });
            return;
        }

        res.status(500).json({
            error: "Error al actualizar la tarea"
        });
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
            res.status(400).json({
                message: "El id es requerido"
            });
            return;
        }

        res.status(500).json({
            error: "Error al actualizar parcialmente la tarea"
        });
    }
}

export const eliminarTarea = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const tareaService = new TareaService();
        const tarea = await tareaService.eliminarTarea(id as string);
        res.status(200).json({
            message: "Tarea eliminada exitosamente"
        });
    } catch (error: any) {
        if (error.message === "No se encontró el id de esta tarea") {
            res.status(400).json({
                message: "El id es requerido"
            });
            return;
        }

        res.status(500).json({
            error: "Error al actualizar parcialmente la tarea"
        });
    }
}

export const obtenerTareaPorEstado = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.params;
        if (!Object.values(Status).includes(status as Status)) {
            res.status(400).json({
                message: "Estado inválido"
            });
            return;
        }
        const tareaService = new TareaService();
        const tareas = await tareaService.obtenerTareaPorEstado(status as Status);
        res.status(200).json(tareas);
    } catch (error: any) {
        if (error.message === "No se encontraron tareas con este estado") {
            res.status(404).json({
                message: "No se encontraron tareas con este estado"
            });
            return;
        }

        res.status(500).json({
            error: "Error al obtener las tareas por estado"
        });
    }
}

export const notificarTareasAVencer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const tareaService = new TareaService();
        const result = await tareaService.notificarTareasAVencer(id as string);
        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === "No se encontró el id de esta tarea") {
            res.status(404).json({
                message: "Tarea no encontrada"
            });
            return;
        }

        if (error.message === "La tarea no tiene una fecha de vencimiento") {
            res.status(400).json({
                message: "La tarea no tiene una fecha de vencimiento"
            });
            return;
        }

        res.status(500).json({
            message: "Error al notificar las tareas a vencer"
        })
    }
}

export const generarReporteTarea = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const tareaService = new TareaService();
        const result = await tareaService.generarReporteTarea(id as string);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: "Hubo un error al generar el reporte de la tarea"
        })
    }
}