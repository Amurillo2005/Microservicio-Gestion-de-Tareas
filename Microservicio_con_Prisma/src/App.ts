import dotenv from "dotenv"
import express from "express";
import cors from "cors";
import tareaRoutes from "./Routes/tareaRoutes"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

app.use("/tareas", tareaRoutes);

export default app;