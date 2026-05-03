import type { ITarea } from "../models/tarea.model.js";
import { Tarea } from "../models/tarea.model.js";

export class TareaService {
    async crearTarea (tarea: ITarea) {
        if (!tarea.title || !tarea.description || !tarea.status || !tarea.assignedTo || !tarea.dueDate) {
            throw new Error("Todos los campos son obligatorios");
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
}