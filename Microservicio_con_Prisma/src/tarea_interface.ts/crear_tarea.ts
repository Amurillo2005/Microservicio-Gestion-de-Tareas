export interface CrearTarea {
    title: string;
    description: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    assignedTo: string;
    dueDate: string;
}