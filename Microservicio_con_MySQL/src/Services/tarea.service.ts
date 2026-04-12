import type { tarea } from "../tarea_interface/tarea.interface.js";
import { pool } from "../db/db.js";

export class TareaService {
    async crearTarea(tarea: tarea){
        if (!tarea.title || !tarea.description || !tarea.status || !tarea.assignedTo || !tarea.dueDate) {
            throw new Error("Todos los campos son obligatorios");
        }

        const tareas = await pool.query(
            "INSERT INTO Tarea (title, description, status, assignedTo, dueDate) VALUES (?, ?, ?, ?, ?)",
            [tarea.title, tarea.description, tarea.status, tarea.assignedTo, tarea.dueDate]
        )

        return tareas;
    }
}