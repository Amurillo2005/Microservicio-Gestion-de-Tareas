import "dotenv/config";
import { Worker } from "bullmq";

export const tareaWorker = new Worker("tarea-queue", async (job) => {
    console.log("Procesando tarea: ", job.name);
    if (job.name === "Notificar due_date") {
        console.log(`Notificación: la tarea ${job.name} está a punto de vencer`)
        return
    }

    if (job.name === "Generar reporte") {
        console.log(`Generando reporte para la tarea: ${job.name}`)
        return
    }

}, {
    connection:{
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
})