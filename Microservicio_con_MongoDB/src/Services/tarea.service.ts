import type { ITarea } from "../models/tarea.model.js";
import { Tarea } from "../models/tarea.model.js";
import mongoose from "mongoose";
import { Temporal } from "@js-temporal/polyfill";
import { tareaQueue } from "../queue/tarea.queue.js";

export class TareaService {
    async crearTarea (tarea: ITarea) {
        if (!tarea.title || !tarea.status ) {
            throw new Error("Campos incompletos");
        }

        const tareaCreada = await Tarea.create(tarea);
        return tareaCreada;
    }

    async obtenerTareas() {
        const tareas = await Tarea.find();
        if (tareas.length === 0) {
            throw new Error("No se encontraron tareas");
        }
        return tareas;
    }

    async obtenerTareaPorId(id: string){

        if (!mongoose.isValidObjectId(id)){
            throw new Error("No se encontró el id de esta tarea");
        }

        const tarea = await Tarea.findById(id);
        if (!tarea) {
            throw new Error("Tarea no encontrada");
        }
        return tarea;
    }

    async actualizarTareaCompleta(id: string, tarea: ITarea){
        if (!mongoose.isValidObjectId(id)){
            throw new Error("No se encontró el id de esta tarea");
        }

        if (!tarea.title || !tarea.description || !tarea.status || !tarea.assignedTo || !tarea.dueDate) {
            throw new Error("Todos los campos son obligatorios");
        }

        const tareaActualizada = await Tarea.findOneAndReplace({ _id: id }, tarea, { returnDocument: "after" });
        return tareaActualizada;
    }

    async actualizarTareaParcial(id: string, tarea: Partial<ITarea>) {
        if (!mongoose.isValidObjectId(id)){
            throw new Error("No se encontró el id de esta tarea");
        }

        const tareaActualizada = await Tarea.findOneAndUpdate({ _id: id }, tarea, { returnDocument: "after" });
        return tareaActualizada;
    }

    async eliminarTarea(id: string) {
        if (!mongoose.isValidObjectId(id)){
            throw new Error("No se encontró el id de esta tarea");
        }

        const tareaEliminada = await Tarea.findByIdAndDelete(id);
        return tareaEliminada;
    }

    async obtenerTareasPorStatus(status: string) {
        const tareas = await Tarea.find({ status });
        if (tareas.length === 0){
            throw new Error("No se encontraron tareas con este status");
        }
        return tareas;
    }

    async programarTrabajoAsincrono(id: string) {

        const tarea = await Tarea.findById(id as string);
        if (!tarea){
            throw new Error("No se encontró el id de esta tarea");
        }

        if (!tarea.dueDate) {
            throw new Error("La tarea no tiene fecha de vencimiento");
        }

        const fechaActual = Temporal.Now.instant();
        const fechaVencimiento = Temporal.Instant.fromEpochMilliseconds(tarea.dueDate.getTime());

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