import taskDB from "../database/taskDB.js";
import TaskModel from "../models/taskModel.js";
// import { v4 as uuid } from 'uuid';
let newId: number = 6;
const UserService = {
    async getAllTasks() {
        const allUsers = await taskDB.getAllTasks();
        return allUsers;
    },

    async getTaskById(id: number) {
        const task = await taskDB.getTaskById(id);
        return task;
    },

    async createNewTask(newTask: TaskModel) {
        const taskToInsert = {
            ...newTask,
            id: newId++
            // id: uuid()
            // ,createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
            // updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
        }
        const createdTask = await taskDB.createNewTask(taskToInsert)
        return createdTask;
    },

    async updateTask(id: number, changedTask: TaskModel) {
        const updatedTask = await taskDB.updateTask(id, changedTask)
        return updatedTask;
    },

    async deleteTask(id: number) {
        taskDB.deleteTask(id)
    },
}

export default UserService