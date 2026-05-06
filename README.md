# Microservicio para gestión de tareas

Este es un microservicio para gestionar tareas que permite las siguientes acciones:

- Crear una tarea.
- Obtener todas las tareas.
- Obtener una tarea por su id.
- Actualizar completamente una tarea.
- Actualizar parcialmente una tarea.
- Eliminar una tarea.
- Obtener una tarea por su estado.
- Programar un trabajo asincrono como notificar cuando la fecha de vecimiento de una tarea se está acercando.

Este microservicio fue desarrollado con tres gestores de bases de datos distintos:

- MongoDB
- MySQL
- Prisma (ORM)

Esto se hizo con el fin de demostrar conocimiento en los tres gestores de bases de datos

## Endpoints para cada microservicio

| Método | Ruta                         | Descripción                        |
|--------|------------------------------|------------------------------------|
| POST   | /tareas/tasks                | Crear una tarea                    |
| GET    | /tareas/tasks                | Obtener todas las tareas           |
| GET    | /tareas/tasks/:id            | Obtener una tarea por id           |
| PUT    | /tareas/tasks/:id            | Actualizar completamente una tarea |
| PATCH  | /tareas/tasks/:id            | Actualizar parcialmente una tarea  | 
| DELETE | /tareas/tasks/:id            | Eliminar una tarea                 |
| GET    | /tareas/tasks/status/:status | Obtener tareas por estado          | 
| POST   | /tareas/tasks/:id/schedule   | Programar trabajo asincrono        |

En donde dice :id reemplazar por el id generado al momento de crear la tarea.
En el caso de los microservicios con Prisma y MongoDB debes poner el id SIN las comillas.

## JSON de ejemplo para cada microservicio

```JSON
{
  "title": "Corregir errores",
  "description": "Se tienen que corregir estos errores en producción lo antes posible ya mismo",
  "status": "IN_PROGRESS",
  "assignedTo": "Rafael Ramirez",
  "dueDate": "2026-05-21"
}
```

Si no asignas un estado, cada microservicio asignará PENDING (pendiente) por defecto al momento de crear la tarea.

## Microservicio con MongoDB

Este microservicio corre en el puerto 3000 entonces cuando lo pruebes en Thunder Client o Postman asegurate de que sea el puerto 3000.

### Tecnologías usadas

- NodeJS
- MongoDB
- TypeScript
- Docker
- BullMQ
- Redis

### Guía para usarlo

- Clonar el repositorio con git clone https://github.com/Amurillo2005/Microservicio-Gestion-de-Tareas.git
- Una vez clonado usa el comando cd Microservicio_con_MongoDB.
- Después usa el comando copy .env.example .env para obtener las variables de entorno y si usas Mac o Linux usa cp .env.example .env
- Por último, usa el comando docker compose up --build para contruir los contenedores en docker.

### Nota

Recuerda previamente tener docker abierto en tu pc.

## Microservicio con MySQL

Este microservicio corre en el puerto 3001 cuando lo pruebas en Thunder Client o Postman asegurate de que sea el puerto 3001.

### Tecnologías usadas

- NodeJS
- MySQL
- TypeScript
- Docker
- BullMQ
- Redis

### Guía para usarlo

- Clonar el repositorio con git clone https://github.com/Amurillo2005/Microservicio-Gestion-de-Tareas.git
- Una vez clonado usa el comando cd Microservicio_con_MySQL.
- Después usa el comando copy .env.example .env para obtener las variables de entorno y si usas Mac o Linux usa cp .env.example .env
- Por último, usa el comando docker compose up --build para contruir los contenedores en docker.

### Nota

Recuerda previamente tener docker abierto en tu pc.

## Microservicio con prisma

Este microservicio corre en el puerto 3001 cuando lo pruebas en Thunder Client o Postman asegurate de que sea el puerto 3001.

### Tecnologías usadas

- NodeJS
- Prisma
- TypeScript
- Docker
- BullMQ
- Redis

### Guía para usarlo

- Clonar el repositorio con git clone https://github.com/Amurillo2005/Microservicio-Gestion-de-Tareas.git
- Una vez clonado usa el comando cd Microservicio_con_Prisma.
- Después usa el comando copy .env.example .env para obtener las variables de entorno y si usas Mac o Linux usa cp .env.example .env
- Por último, usa el comando docker compose up --build para contruir los contenedores en docker.

### Nota

Recuerda previamente tener docker abierto en tu pc.

## Retos de este microservicio

Mi mayor reto en el desarrollo de este microservicio fue usar una cola de trabajo como BullMQ porque nunca antes lo había usado.