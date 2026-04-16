import "dotenv/config";
import { Queue } from "bullmq";

export const tareaQueue = new Queue("tareaQueue", {
    connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379
    }
})