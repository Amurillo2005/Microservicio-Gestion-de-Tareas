import type { ITarea } from "../models/tarea.model.js";
import { Tarea } from "../models/tarea.model.js";
import mongoose from "mongoose";
import type { tarea } from "../tarea_interface/tarea.interface.js";

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

}