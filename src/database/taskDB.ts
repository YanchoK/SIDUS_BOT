import DB from "./db.json"
import TaskModel from "../models/taskModel.js";
import { readFile, writeFile } from 'fs/promises';
import Utils from "./utils.js";

const Task = {
    getAllTasks() {
        try {
            return DB.task
        } catch (error) {
            throw { status: 500, message: error };
        }
    },

    async getTaskById(id: number) {
        try {
            const task = DB.task.find((task) => task.id === id);
            if (!task) {
                throw {
                    status: 400,
                    message: `Can't find workout with the id '${id}'`,
                };
            }
            return task;
        } catch (error: any) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    },

    async createNewTask(newTask: TaskModel) {
        const isAlreadyAdded = await DB.task.findIndex((task) => task.name === newTask.name) > -1
        if (isAlreadyAdded) {
            throw {
                status: 400,
                message: `Task with the name '${newTask.name}' already exists`,
            };
        }
        try {
            await DB.task.push(newTask)
            await Utils.saveToDatabase(DB)
            return newTask;
        }
        catch (error: any) {
            throw { status: 500, message: error.message };
        }
    },

    async updateTask(id: number, changedTask: TaskModel) {
        try {
            const isAlreadyAdded =
                DB.task.findIndex((task) => task.name === changedTask.name) > -1;
            if (isAlreadyAdded) {
                throw {
                    status: 400,
                    message: `Workout with the name '${changedTask.name}' already exists`,
                };
            }
            const taskIndex = await DB.task.findIndex((task) => task.id === id)

            if (taskIndex === -1) {
                throw {
                    status: 400,
                    message: `Can't find workout with the id '${id}'`,
                };
            }
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
        } catch (error: any) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    },

    async deleteTask(id: number) {
        try {
            const taskIndex = await DB.task.findIndex((task) => task.id === id);
            if (taskIndex === -1) {
                throw {
                    status: 400,
                    message: `Can't find workout with the id '${id}'`,
                };
            }
            await DB.task.splice(taskIndex, 1);
            await Utils.saveToDatabase(DB);
        } catch (error: any) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    },
}

export default Task;