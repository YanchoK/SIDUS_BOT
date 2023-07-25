import { PrismaClient } from "@prisma/client";
import taskService from '../services/taskService.js';
const prisma = new PrismaClient();
const TaskController = {
    async getAllTasks(req, res) {
        try {
            const allTasks = await taskService.getAllTasks();
            res.status(200).json(allTasks);
        }
        catch (error) {
            res.status(500)
                .send({ status: "FAILED", data: { error: error.message } });
        }
    },
    async getTaskById(req, res) {
        const { params: { id } } = req;
        if (!id) {
            res
                .status(400)
                .send({
                status: "FAILED",
                data: { error: "Parameter ':id' can not be empty" },
            });
        }
        try {
            const task = await taskService.getTaskById(parseInt(id));
            res.status(200).json(task);
        }
        catch (error) {
            res
                .status(error?.status || 500)
                .send({ status: "FAILED", data: { error: error?.message || error } });
        }
    },
    async createNewTask(req, res) {
        const { body } = req;
        if (!body.name ||
            !body.message ||
            !body.datetime ||
            !body.recurring ||
            !body.chat_url ||
            !body.bot_id) {
            res.status(400).send({
                status: "400",
                data: {
                    error: "One of the following keys is missing or is empty in request body: 'name', 'message', 'datetime', 'recurring', 'bot_id'",
                },
            });
            return;
        }
        else {
            const newTask = {
                name: body.name,
                message: body.message,
                datetime: body.datetime,
                recurring: body.recurring,
                chat_url: body.chat_url,
                bot_id: body.bot_id
            };
            try {
                const createdTask = await taskService.createNewTask(newTask);
                res.status(200).json({ message: "Task is created", data: createdTask });
            }
            catch (error) {
                res.status(error?.status || 500)
                    .send({ status: "FAILED", data: { error: error?.message || error } });
            }
        }
    },
    async updateTask(req, res) {
        const { body, params: { id } } = req;
        if (!id) {
            res
                .status(400)
                .send({
                status: "FAILED",
                data: { error: "Parameter ':id' can not be empty" },
            });
        }
        try {
            const updatedTask = await taskService.updateTask(parseInt(id), body);
            res.status(200).json({ message: "Task is updated", data: updatedTask });
        }
        catch (error) {
            res
                .status(error?.status || 500)
                .send({ status: "FAILED", data: { error: error?.message || error } });
        }
    },
    async deleteTask(req, res) {
        const { params: { id } } = req;
        if (!id) {
            res
                .status(400)
                .send({
                status: "FAILED",
                data: { error: "Parameter ':id' can not be empty" },
            });
        }
        try {
            await taskService.deleteTask(parseInt(id));
            res.status(200).json({ message: "Task is deleted" });
        }
        catch (error) {
            res
                .status(error?.status || 500)
                .send({ status: "FAILED", data: { error: error?.message || error } });
        }
    },
};
export default TaskController;
//# sourceMappingURL=taskController.js.map