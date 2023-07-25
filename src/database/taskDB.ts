import DB from "./db.json"
import TaskModel from "../models/taskModel.js";
import { readFile, writeFile } from 'fs/promises';
import Utils from "./utils.js";

const Task = {
    getAllTasks() {
        return DB.task
    },

    async getTaskById(id: number) {
        return DB.task.find((task) => task.id === id);
    },

    async createNewTask(newTask: TaskModel) {
        const isAlreadyAdded = await DB.task.findIndex((task) => task.name === newTask.name) > -1
        if (!isAlreadyAdded) {
            await DB.task.push(newTask)
            await Utils.saveToDatabase(DB)
            return newTask;
        }
        return;
    },

    async updateTask(id: number, changedTask: TaskModel) {
        const taskIndex = await DB.task.findIndex((task) => task.id === id)
        if (taskIndex !== -1) {
            const updatedTask = {
                ...DB.task[taskIndex],
                ...changedTask,
                // updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
            };
            DB.task[taskIndex] = changedTask;
            await Utils.saveToDatabase(DB);
            return updatedTask;
        }

        return;
    },

    async deleteTask(id: number) {
        const taskIndex = await DB.task.findIndex((task) => task.id === id);
        await DB.task.splice(taskIndex, 1);
        await Utils.saveToDatabase(DB);
    },
}

export default Task;