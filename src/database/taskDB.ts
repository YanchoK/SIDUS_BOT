import DB from "./db.json"
import TaskModel from "../models/taskModel.js";
import { readFile, writeFile } from 'fs/promises';
import Utils from "./utils.js";
import { PrismaClient } from '@prisma/client'
import { date } from "joi";

const prisma = new PrismaClient()

const Task = {
    async getAllTasks() {
        try {
            return await prisma.task.findMany()
        } catch (error) {
            throw { status: 500, message: error };
        }
    },
    async getAllTasksInRange(page: number, limit: number) {
        try {
            //faster variant, but need additional indexation in the db
            // let cursorPosition: number = page * limit - (limit - 1);
            // //if there are no more elements, return the last element
            // const lastIndex = await prisma.task.count()
            // if (cursorPosition > lastIndex) {
            //     cursorPosition = lastIndex
            // }
            // const allTasksInRange = await prisma.task.findMany({
            //     take: limit,
            //     cursor: {
            //         id: cursorPosition,
            //     },
            // });

            //not skallable slower variant
            const allTasksInRange= await prisma.task.findMany({
                skip: (page-1) * limit,
                take: limit,
            });

            if (allTasksInRange.length === 0) {
                const tasksCount = await prisma.task.count()
                throw { status: 500, message: `Number of elements exieded! Elements count: ${tasksCount}.` };
            }

            return allTasksInRange;
        } catch (error) {
            throw error;
        }
    },

    async getTaskById(taskId: number) {
        try {
            const task = await prisma.task.findFirstOrThrow({
                where: {
                    id: taskId
                }
            });
            return task;
        } catch (error: any) {
            throw { status: error?.status || 500, message: `Can't find task with id ${taskId}` || error };
        }
    },

    async createNewTask(newTask: TaskModel) {
        await prisma.task.create({
            data: {
                title: newTask.name,
                content: newTask.message,
                remindTime: new Date(),
                chatUrl_id: 1,
                bot_id: 1
            },
        })
        // const isAlreadyAdded = await DB.task.findIndex((task) => task.name === newTask.name) > -1
        // if (isAlreadyAdded) {
        //     throw {
        //         status: 400,
        //         message: `Task with the name '${newTask.name}' already exists`,
        //     };
        // }
        // try {
        //     await DB.task.push(newTask)
        //     await Utils.saveToDatabase(DB)
        //     return newTask;
        // }
        // catch (error: any) {
        //     throw { status: 500, message: error.message };
        // }
    },

    async updateTask(taskId: number, changedTask: TaskModel) {
        try {
            await this.getTaskById(taskId);
            const updatedTask = await prisma.task.update({
                where: {
                    id: taskId,
                },
                data: changedTask,
            })
            return updatedTask;
        } catch (error: any) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    },

    async deleteTask(taskId: number) {
        try {
            await this.getTaskById(taskId);
            await prisma.task.delete({
                where: {
                    id: taskId
                }
            })
        } catch (error: any) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    },
}

export default Task;