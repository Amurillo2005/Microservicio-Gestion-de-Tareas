import type { tarea } from "../tarea_interface/tarea.interface.js";
import { pool } from "../db/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export class TareaService {
    async crearTarea(tarea: tarea){
        if (!tarea.title || !tarea.description || !tarea.status || !tarea.assignedTo || !tarea.dueDate) {
            throw new Error("Todos los campos son obligatorios");
        }

        const [tareas] = await pool.query<ResultSetHeader>(
            "INSERT INTO Tarea (title, description, status, assignedTo, dueDate) VALUES (?, ?, ?, ?, ?)",
            [tarea.title, tarea.description, tarea.status, tarea.assignedTo, tarea.dueDate]
        );

        return {
            ...(tareas.insertId ? { id: tareas.insertId } : {}),
            ...tarea
        };
    }

    async obtenerTodasLasTareas() {
        const [tareas] = await pool.query<RowDataPacket[]>("SELECT * FROM Tarea");
        if (tareas.length === 0) {
            throw new Error("No se encontraron tareas");
        }
        return tareas;
    }

    async obtenerTareasPorId(id: number){
        const [tareas] = await pool.query<RowDataPacket[]>("SELECT * FROM Tarea WHERE id = ?", [id]);
        if (tareas.length === 0) {
            throw new Error("Tarea no encontrada");
        }
        return tareas;
    }

    async actualizarTareaCompleta(id: number, tarea: tarea){
        if (!id) {
            throw new Error("No se encontró el id de esta tarea")
        }

        if (!tarea.title || !tarea.description || !tarea.status || !tarea.assignedTo || !tarea.dueDate) {
            throw new Error("Todos los campos son obligatorios");
        }

        const [tareas] = await pool.query<ResultSetHeader>(
            "UPDATE Tarea SET title = ?, description = ?, status = ?, assignedTo = ?, dueDate = ? WHERE id = ?",
            [tarea.title, tarea.description, tarea.status, tarea.assignedTo, tarea.dueDate, id]
        );

        return {
            ...(tareas.insertId ? { id: tareas.insertId } : {}),
            ...tarea
        };
    }

    async actualizarTareaParcial(id: number, tarea: Partial<tarea>){
        if (!id) {
            throw new Error("No se encontró el id de esta tarea")
        }

        const [tareas] = await pool.query<ResultSetHeader>(
            "UPDATE Tarea SET title = COALESCE(?, title), description = COALESCE(?, description), status = COALESCE(?, status), assignedTo = COALESCE(?, assignedTo), dueDate = COALESCE(?, dueDate) WHERE id = ?",
            [tarea.title ?? null, tarea.description ?? null, tarea.status ?? null, tarea.assignedTo ?? null, tarea.dueDate ?? null, id]
        );

        return {
            ...(tareas.insertId ? { id: tareas.insertId } : {}),
            ...tarea
        };
    }

    async eliminarTarea(id: number){

        const [tareas] = await pool.query<ResultSetHeader>(
            "DELETE FROM Tarea WHERE id = ?", [id]
        );

        if (tareas.affectedRows === 0) {
            throw new Error("No se encontró el id de esta tarea");
        }

        return { message: "Tarea eliminada exitosamente" };
    }

    async obtenerTareaPorEstado(status: string){
        const [tareas] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM Tarea WHERE status = ?", [status]
        )
        return tareas;
    }
 
}
