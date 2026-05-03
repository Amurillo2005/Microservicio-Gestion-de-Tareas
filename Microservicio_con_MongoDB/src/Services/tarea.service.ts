import type { ITarea } from "../models/tarea.model.js";
import { Tarea } from "../models/tarea.model.js";
import mongoose from "mongoose";
import type { tarea } from "../tarea_interface/tarea.interface.js";

export class TareaService {
    async crearTarea (tarea: ITarea) {
        if (!tarea.title || !tarea.status ) {
            throw new Error("Estos campos son obligatorios");
        }

        const tareaCreada = await Tarea.create(tarea);
        return tareaCreada;
    }

    async obtenerTareas() {
        const tareas = await Tarea.find();
        if (!tareas) {
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

}