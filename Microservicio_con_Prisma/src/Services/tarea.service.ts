import { prisma } from "../Cliente/cliente.js";
import type { tarea } from "../tarea_interface.ts/tarea.interface.js";
import { Status } from "../generated/prisma/enums.js";
import { tareaQueue } from "../queue/tarea.queue.js";
import { Temporal } from "@js-temporal/polyfill";

export class TareaService {
    async crearTarea(tarea: tarea) {
        if (!tarea.title) {
            throw new Error("El titulo es requerido");
        }

        const nuevaTarea = await prisma.tarea.create({
            data: {
                title: tarea.title,
                description: tarea.description ?? null,
                status: tarea.status ?? "PENDING",
                assignedTo: tarea.assignedTo ?? null,
                dueDate: tarea.dueDate ? new Date(Temporal.PlainDate.from(tarea.dueDate).toString()) : null
            }
        })

        return nuevaTarea;
    }

    async obtenerTodasLasTareas() {
        const tarea = await prisma.tarea.findMany();
        if (tarea.length === 0) {
            throw new Error("No se encontraron tareas");
        }
        return tarea;
    }

    async obtenerTareasPorId(id: string) {

        const tarea = await prisma.tarea.findUnique({
            where: { id }
        })

        if (!tarea?.id) {
            throw new Error("Tarea no encontrada");
        }
        
        return tarea;
    }

    async actualizarTareaCompleta(id: string, tarea: tarea) {

        if (!tarea.title || !tarea.description || !tarea.status || !tarea.assignedTo || !tarea.dueDate) {
            throw new Error("Campos incompletos");
        }

        const tareaActualizada = await prisma.tarea.update({
            where: { id },
            data: {
                title: tarea.title,
                description: tarea.description,
                status: tarea.status,
                assignedTo: tarea.assignedTo,
                ...(tarea.dueDate && { dueDate: new Date(Temporal.PlainDate.from(tarea.dueDate).toString()) }),
            }
        })

        if (!tareaActualizada.id) {
            throw new Error("Tarea no encontrada");
        }

        return tareaActualizada;
    }

    async actualizarTareaParcial(id: string, tarea: tarea) {
        
        const tareaActualizada = await prisma.tarea.update({
            where: { id },
            data: {
                title: tarea.title,
                description: tarea.description ?? null,
                status: tarea.status,
                assignedTo: tarea.assignedTo ?? null,
                ...(tarea.dueDate && { dueDate: new Date(Temporal.PlainDate.from(tarea.dueDate).toString()) }),
            }
        })

        if (!tareaActualizada.id) {
            throw new Error("Tarea no encontrada")
        }

        return tareaActualizada;
    }

    async eliminarTarea(id: string) {
        
        const tarea = await prisma.tarea.delete({
            where: { id }
        })

        if (!tarea.id) {
            throw new Error("Tarea no encontrada")
        }

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

        const tarea = await prisma.tarea.findUnique({
            where: { id }
        })

        if (!tarea?.id) {
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
