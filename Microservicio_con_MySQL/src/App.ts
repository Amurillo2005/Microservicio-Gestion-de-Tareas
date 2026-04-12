import express from "express";
import dotenv from "dotenv";
import { pool } from "./db/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json())

app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`)
})

async function conectarDB() {
  try {
    const connection = await pool.getConnection()
    console.log('Conexión exitosa a la base de datos')
    connection.release()
  } catch (error) {
    console.error('Error conectando a la base de datos:', error)
  }
}

conectarDB()