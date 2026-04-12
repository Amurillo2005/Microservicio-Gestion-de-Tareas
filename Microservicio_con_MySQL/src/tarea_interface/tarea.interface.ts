export interface tarea {
    title: string;
    description: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    assignedTo: string;
    dueDate: string;
}