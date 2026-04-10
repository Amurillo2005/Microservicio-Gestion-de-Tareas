import dotenv from "dotenv"
import express from "express";
import tareaRoutes from "./Routes/tareaRoutes.js"
import "dotenv/config";
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

app.use("/tareas", tareaRoutes);

export default app;