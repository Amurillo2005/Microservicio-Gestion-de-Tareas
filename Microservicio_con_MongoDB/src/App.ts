import express from "express";
import "dotenv/config";
import { connectDB } from "./db/db.js";
import tareaRoutes from "./Routes/tarea.routes.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/tareas", tareaRoutes);

connectDB()

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});