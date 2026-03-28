import "dotenv/config";
import { Queue } from "bullmq";

export const tareaQueue = new Queue("tarea-queue", {
    connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    }
})