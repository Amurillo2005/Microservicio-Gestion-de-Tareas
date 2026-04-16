import "dotenv/config";
import { Worker } from "bullmq";;
export const tareaWorker = new Worker("tareaQueue", async (job) => {
    if (job.name === "Notificar fecha de vencimiento") {
        console.log(`Notificación: la tarea ${job.data.title} está a punto de vencer`)
        return
    }

}, {
    connection:{
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
})