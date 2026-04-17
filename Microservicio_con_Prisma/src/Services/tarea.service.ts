import { prisma } from "../Cliente/cliente.js";
import type { CrearTarea } from "../tarea_interface.ts/crear_tarea.js";
import { Status } from "../generated/prisma/enums.js";
import { tareaQueue } from "../queue/tarea.queue.js";
import { Temporal } from "@js-temporal/polyfill";

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

    async programarTrabajoAsincrono(id: string) {
        if (!id) {
            throw new Error("No se encontró el id de esta tarea")
        }

        const tarea = await prisma.tarea.findUnique({
            where: { id }
        })

        if (!tarea) {
            throw new Error("Tarea no encontrada");
        }

        const fechaActual = Temporal.Now.instant();
        const fechaVencimiento = Temporal.Instant.fromEpochMilliseconds(tarea.dueDate!.getTime());

        const JobId = `notificacion-${tarea.id}`;
        
        const trabajoExistente = await tareaQueue.getJob(JobId);

        if (trabajoExistente) {
            throw new Error("Este trabajo ya ha sido programado")
        }

        if (Temporal.Instant.compare(fechaActual, fechaVencimiento) === -1) {
            await tareaQueue.add("Notificar fecha de vencimiento", {
                tareaId: tarea.id,
                title: tarea.title
            },{
                jobId: JobId,
                removeOnComplete: false
            })
        }else {
            throw new Error("La tarea ya ha vencido");
        }

    }

}
