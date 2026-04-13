import type { tarea } from "../tarea_interface/tarea.interface.js";
import { pool } from "../db/db.js";
import type { RowDataPacket } from "mysql2";

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

    async obtenerTodasLasTareas() {
        const [tareas] = await pool.query<RowDataPacket[]>("SELECT * FROM Tarea");
        if (tareas.length === 0) {
            throw new Error("No se encontraron tareas");
        }
        return tareas;
    }

    async obtenerTareasPorId(id: string){
        const [tareas] = await pool.query<RowDataPacket[]>("SELECT * FROM Tarea WHERE id = ?", [id]);
        if (tareas.length === 0) {
            throw new Error("No se encontraron tareas");
        }
        return tareas;
    }

    
}