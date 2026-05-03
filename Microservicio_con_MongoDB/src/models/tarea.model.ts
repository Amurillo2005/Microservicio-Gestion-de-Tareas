import mongoose, { Document } from "mongoose";
import type { tarea } from "../tarea_interface/tarea.interface.js";

export interface ITarea extends tarea, Document {}

const tareaSchema = new mongoose.Schema<ITarea>({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["PENDING", "IN_PROGRESS", "COMPLETED"], default: "PENDING"},
    assignedTo: { type: String },
    dueDate: { type: Date }
},
  { timestamps: true }
)

export const Tarea = mongoose.model("Tarea", tareaSchema);