import { PrismaClient } from "@prisma/client";
import taskService from '../services/taskService.js';
const prisma = new PrismaClient();
const checkForId = (id) => {
    if (!id) {
        throw {
            status: "FAILED",
            data: { error: "Parameter ':id' can not be empty" }
        };
    }
};
const TaskController = {
    async getAllTasks(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let allTasks;
        try {
            if (!req.query.page && !req.query.limit) {
                allTasks = await taskService.getAllTasks();
            }
            else {
                allTasks = await taskService.getAllTasksInRange(page, limit);
            }
            res.status(200).send({ count: allTasks.length, tasks: allTasks });
        }
        catch (error) {
            res.status(500)
                .send({ status: "FAILED", data: { error: error.message } });
        }
    },
    async getTaskById(req, res) {
        const { params: { id } } = req;
        try {
            const task = await taskService.getTaskById(parseInt(id));
            res.status(200).json(task);
        }
        catch (error) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    },
    async createNewTask(req, res) {
        const { title, content, chatUrl_id, bot_id, user_id, remindTime, recurring, sent, updatedAt } = req.body;
        if (!title ||
            !content ||
            !chatUrl_id ||
            !bot_id) {
            res.status(400).send({
                status: "400",
                data: {
                    error: "One of the following keys is missing or is empty in request body: 'title', 'content', 'chatUrl_id', 'bot_id', 'user_id'",
                },
            });
            return;
        }
        else {
            const newTask = {
                title: title,
                content: content,
                bot_id: bot_id,
                chatUrl_id: chatUrl_id,
                user_id: user_id,
                remindTime: remindTime,
                recurring: recurring,
                sent: sent,
                updatedAt: updatedAt
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
        try {
            const updatedTask = await taskService.updateTask(parseInt(id), body);
            res.status(200).json({ message: "Task is updated", data: updatedTask });
        }
        catch (error) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    },
    async deleteTask(req, res) {
        const { params: { id } } = req;
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