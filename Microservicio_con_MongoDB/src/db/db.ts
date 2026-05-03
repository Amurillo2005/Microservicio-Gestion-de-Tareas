import mongoose from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI!);
        console.log(`MongoDB conectado en: ${connection.connection.host}`);
    } catch (error) {
        console.error("Error al conectar con MongoDB:", error);
        process.exit(1);
    }
}