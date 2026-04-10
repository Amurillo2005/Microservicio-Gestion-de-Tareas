import { prisma } from "../Cliente/cliente.js";
import type { CrearTarea } from "../tarea_interface.ts/crear_tarea.js";
import { Status } from "../generated/prisma/enums.js";
import { tareaQueue } from "../queue/tarea.queue.js";

export class TareaService {
    async crearTarea(data: CrearTarea) {
        if (!data.title || !data.description || !data.status || !data.assignedTo || !data.dueDate) {
            throw new Error("Todos los campos son obligatorios");
        }

        const tarea = await prisma.tarea.create({
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                assignedTo: data.assignedTo,
                dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
            }
        })

        return tarea;
    }

    async obtenerTodasLasTareas() {
        const tarea = await prisma.tarea.findMany();
        if (tarea.length === 0) {
            throw new Error("No se encontraron tareas");
        }
        return tarea;
    }

    async obtenerTareasPorId(id: string) {
        if (!id) {
            throw new Error("No se encontró el id de esta tarea");
        }
        const tarea = await prisma.tarea.findUnique({
            where: { id }
        })

        if (!tarea) {
            throw new Error("Tarea no encontrada");
        }
        return tarea;
    }

    async actualizarTareaCompleta(id: string, data: CrearTarea) {
        if (!id) {
            throw new Error("No se encontró el id de esta tarea")
        }

        if (!data.title || !data.description || !data.status || !data.assignedTo || !data.dueDate) {
            throw new Error("Todos los campos son obligatorios");
        }

        const tarea = await prisma.tarea.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                assignedTo: data.assignedTo,
                ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
            }
        })

        return tarea;
    }

    async actualizarTareaParcial(id: string, data: CrearTarea) {
        if (!id) {
            throw new Error("No se encontró el id de esta tarea")
        }

        const tarea = await prisma.tarea.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                status: data.status,
                assignedTo: data.assignedTo,
                ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
            }
        })
        return tarea;
    }

    async eliminarTarea(id: string) {
        if (!id) {
            throw new Error("No se encontró el id de esta tarea")
        }

        const tarea = await prisma.tarea.delete({
            where: { id }
        })
        return tarea;
    }

    async obtenerTareaPorEstado(status: Status) {
        if (!status) {
            throw new Error("El estado es requerido");
        }

        const tarea = await prisma.tarea.findMany({
            where: { status }
        })

        if (tarea.length === 0) {
            throw new Error("No se encontraron tareas con este estado");
        }

        return tarea
    }

    async notificarTareasAVencer(id: string) {
        if (!id) {
            throw new Error("No se encontró el id de esta tarea")
        }

        const tarea = await prisma.tarea.findUnique({
            where: { id }
        })

        if (!tarea) {
            throw new Error("Tarea no encontrada");
        }

        if (!tarea.dueDate) {
            throw new Error("La tarea no tiene una fecha de vencimiento");
        }

        await tareaQueue.add("Notificar due_date",
            { tareaID: id },
            { delay: 5000 }

        )

        return {
            message: "Notificación programada correctamente"
        };
    }

    async generarReporteTarea(id: string) {

        if (!id) {
            throw new Error("No se encontró el id de esta tarea")
        }
        await tareaQueue.add("Generar reporte", {
            tareaId: id
        })

        return { message: "Reporte en proceso" }

    }
}
