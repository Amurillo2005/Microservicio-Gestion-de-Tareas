import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json())

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})