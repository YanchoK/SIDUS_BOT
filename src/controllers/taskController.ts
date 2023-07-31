import { Request, Response } from 'express';
import TaskService from '../services/taskService.js'
import TaskModel from '../models/taskModel.js';

export default class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    getAllTasks = async (req: Request, res: Response) => {
        const page: number = parseInt(req.query.page as string) || 1; // The requested page number
        const limit: number = parseInt(req.query.limit as string) || 10; // Number of items per page
        let allTasks: any;
        try {
            if (!req.query.page && !req.query.limit) {
                allTasks = await this.taskService.getAllTasks();
            }
            else {
                allTasks = await this.taskService.getAllTasksInRange(page, limit);
            }
            res.status(200).send({ count: allTasks.length, tasks: allTasks });
        }
        catch (error: any) {
            res.status(500)
                .send({ status: "FAILED", data: { error: error.message } });
        }
    }

    getTaskById = async (req: Request, res: Response) => {
        const { params: { id } } = req;
        try {
            const task = await this.taskService.getTaskById(parseInt(id))
            res.status(200).json(task)
        } catch (error: any) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
        // res.status(500).json({ error: 'An error occurred while retrieving user.' });
    }

    createNewTask = async (req: Request, res: Response) => {
        const { title, content, chat_id, bot_id, user_id, remindTime, recurring, sent, updatedAt } = req.body;
        if (
            !title ||
            !content ||
            !chat_id ||
            !bot_id ||
            !user_id
        ) {
            res.status(400).send({
                status: "400",
                data: {
                    error:
                        "One of the following keys is missing or is empty in request body: 'title', 'content', 'chatUrl_id', 'bot_id', 'user_id'",
                },
            });//.json({ error: 'Invalid task data' });
            return;
        } else {
            // The body does not match the TaskModel interface. Handle the error appropriately.

            // datetime: new Date(Date.parse(body.datetime)),
            const newTask: TaskModel = {
                title: title,
                content: content,
                chat_id: Number(chat_id),
                bot_id: Number(bot_id),
                user_id: Number(user_id),
                remindTime: remindTime,
                recurring: recurring,
                sent: sent
            }
            try {
                const createdTask = await this.taskService.createNewTask(newTask)
                res.status(200).json({ message: "Task is created", data: createdTask });
            }
            catch (error: any) {
                res.status(error?.status || 500)
                    .send({ status: "FAILED", data: { error: error?.message || error } });
            }
        }
    }


    updateTask = async (req: Request, res: Response) => {
        const { body, params: { id } } = req;
        try {
            const updatedTask = await this.taskService.updateTask(parseInt(id), body as TaskModel)
            res.status(200).json({ message: "Task is updated", data: updatedTask });
        } catch (error: any) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    }

    deleteTask = async (req: Request, res: Response) => {
        const { params: { id } } = req;
        try {
            await this.taskService.deleteTask(parseInt(id))
            res.status(200).json({ message: "Task is deleted" });
        } catch (error: any) {
            res
                .status(error?.status || 500)
                .send({ status: "FAILED", data: { error: error?.message || error } });
        }
    }

}