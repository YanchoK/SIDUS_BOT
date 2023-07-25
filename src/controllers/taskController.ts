import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import UserModel from '../models/userModel.js';
import taskService from '../services/taskService.js'
import TaskModel from '../models/taskModel.js';
const prisma = new PrismaClient()

const TaskController = {
    async getAllTasks(req: Request, res: Response) {
        try {
            const allTasks = await taskService.getAllTasks();
            res.status(200).json(allTasks);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving users.' });
        }
    },

    async getTaskById(req: Request, res: Response) {
        const { params: { id } } = req;
        const task = await taskService.getTaskById(parseInt(id))
        res.status(200).json(task)

        // res.status(500).json({ error: 'An error occurred while retrieving user.' });
    },

    async createNewTask(req: Request, res: Response) {
        const { body } = req;
        console.log(body)

        if (
            !body.name ||
            !body.message ||
            !body.datetime ||
            !body.recurring ||
            !body.chat_url ||
            !body.bot_id
        ) {
            res.status(400).json({ error: 'Invalid task data' });
        } else {
            // The body does not match the TaskModel interface. Handle the error appropriately.

            // datetime: new Date(Date.parse(body.datetime)),
            const newTask: TaskModel = {
                id: 5,
                name: body.name,
                message: body.message,
                datetime: body.datetime,
                recurring: body.recurring,
                chat_url: body.chat_url,
                bot_id: body.bot_id
            }
            taskService.createNewTask(newTask)
            res.status(200).json({ message: "Task is created", newTask: newTask });
        }
    },


    async updateTask(req: Request, res: Response) {
        const { body, params: { id } } = req;
        const updatedTask = await taskService.updateTask(parseInt(id), body as TaskModel)
        res.status(200).json({ message: "Task is updated", updatedTask: updatedTask });
    },

    async deleteTask(req: Request, res: Response) {
        const { params: { id } } = req;
        await taskService.deleteTask(parseInt(id))
        res.status(200).json({ message: "Task is deleted"});
    },

}
export default TaskController;