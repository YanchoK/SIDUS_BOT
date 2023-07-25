import taskDB from "../database/taskDB.js";
import TaskModel from "../models/taskModel.js";
// import { v4 as uuid } from 'uuid';
const TaskService = {
    async getAllTasks() {
        try {
            const allTasks = await taskDB.getAllTasks();
            return allTasks;
        } catch (error) {
            throw error;
        }
    },

    async getAllTasksInRange(startIndex: number, endIndex: number) {
        try {
            const allTasksInRange = await taskDB.getAllTasksInRange(startIndex, endIndex);
            return allTasksInRange;
        } catch (error) {
            throw error;
        }
    },

    async getTaskById(id: number) {
        try {
            const task = await taskDB.getTaskById(id);
            return task;
        } catch (error) {
            throw error;
        }
    },

    async createNewTask(newTask: any) {
        let newId = 8         //change later!
        const taskToInsert: TaskModel = {
            id: newId,
            ...newTask
            // id: uuid()
            // ,createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
            // updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        }

        try {
            const createdTask = await taskDB.createNewTask(taskToInsert)
            return createdTask;
        }
        catch (error) {
            throw error;
        }
    },

    async updateTask(id: number, changedTask: TaskModel) {
        try {
            const updatedTask = await taskDB.updateTask(id, changedTask)
            return updatedTask;
        }
        catch (error) {
            throw error;
        }
    },

    async deleteTask(id: number) {
        try {
            taskDB.deleteTask(id)
        }
        catch (error) {
            throw error;
        }
    },
}

export default TaskService