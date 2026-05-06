import type { tarea } from "../tarea_interface/tarea.interface.js";
import { pool } from "../db/db.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { tareaQueue } from "../queue/tarea.queue.js";
import { Temporal } from "@js-temporal/polyfill";

export class TareaService {
    async crearTarea(tarea: tarea) {
        if (!tarea.title) {
            throw new Error("El titulo es requerido");
        }


        const [tareas] = await pool.query<ResultSetHeader>(
            "INSERT INTO Tarea (title, description, status, assignedTo, dueDate) VALUES (?, ?, ?, ?, ?)",
            [tarea.title, tarea.description, tarea.status ?? "PENDING", tarea.assignedTo, tarea.dueDate]
        );

        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM Tarea WHERE id = ?",
            [tareas.insertId]
        );

        return rows[0];
    }

    async obtenerTodasLasTareas() {
        const [tareas] = await pool.query<RowDataPacket[]>("SELECT * FROM Tarea");
        if (tareas.length === 0) {
            throw new Error("No se encontraron tareas");
        }
        return tareas;
    }

    async obtenerTareasPorId(id: number) {
        const [tareas] = await pool.query<RowDataPacket[]>("SELECT * FROM Tarea WHERE id = ?", [id]);
        if (tareas.length === 0) {
            throw new Error("Tarea no encontrada");
        }
        return tareas;
    }

    async actualizarTareaCompleta(id: number, tarea: tarea) {
        if (!id) {
            throw new Error("No se encontró el id de esta tarea")
        }

        if (!tarea.title || !tarea.description || !tarea.status || !tarea.assignedTo || !tarea.dueDate) {
            throw new Error("Campos incompletos");
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

    async actualizarTareaParcial(id: number, tarea: Partial<tarea>) {
        if (!id) {
            throw new Error("No se encontró el id de esta tarea")
        }

        const [tareas] = await pool.query<ResultSetHeader>(
            "UPDATE Tarea SET title = COALESCE(?, title), description = COALESCE(?, description), status = COALESCE(?, status), assignedTo = COALESCE(?, assignedTo), dueDate = COALESCE(?, dueDate) WHERE id = ?",
            [tarea.title ?? null, tarea.description ?? null, tarea.status ?? null, tarea.assignedTo ?? null, tarea.dueDate ?? null, id]
        );

        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM Tarea WHERE id = ?",
            [id]
        );

        return rows[0];
    }

    async eliminarTarea(id: number) {

        const [tareas] = await pool.query<ResultSetHeader>(
            "DELETE FROM Tarea WHERE id = ?", [id]
        );

        if (tareas.affectedRows === 0) {
            throw new Error("No se encontró el id de esta tarea");
        }

        return { message: "Tarea eliminada exitosamente" };
    }

    async obtenerTareaPorEstado(status: string) {
        const [tareas] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM Tarea WHERE status = ?", [status]
        )
        return tareas;
    }

    async programarTrabajoAsincrono(id: number) {
        const [tareas] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM Tarea WHERE id = ?", [id]
        )

        const tarea = tareas[0]!;

        if (tareas.length === 0) {
            throw new Error("Tarea no encontrada");
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
            }, {
                jobId: JobId,
                removeOnComplete: false
            })
        } else {
            throw new Error("La tarea ya ha vencido");
        }

    }

}
