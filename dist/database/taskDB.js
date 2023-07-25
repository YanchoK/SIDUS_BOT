import DB from "./db.json";
import Utils from "./utils.js";
const Task = {
    getAllTasks() {
        try {
            return DB.task;
        }
        catch (error) {
            throw { status: 500, message: error };
        }
    },
    async getAllTasksInRange(startIndex, endIndex) {
        try {
            if (endIndex > DB.task.length) {
                endIndex = DB.task.length;
            }
            const allTasksInRange = await DB.task.slice(startIndex, endIndex);
            return allTasksInRange;
        }
        catch (error) {
            throw error;
        }
    },
    async getTaskById(id) {
        try {
            const task = DB.task.find((task) => task.id === id);
            if (!task) {
                throw {
                    status: 400,
                    message: `Can't find workout with the id '${id}'`,
                };
            }
            return task;
        }
        catch (error) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    },
    async createNewTask(newTask) {
        const isAlreadyAdded = await DB.task.findIndex((task) => task.name === newTask.name) > -1;
        if (isAlreadyAdded) {
            throw {
                status: 400,
                message: `Task with the name '${newTask.name}' already exists`,
            };
        }
        try {
            await DB.task.push(newTask);
            await Utils.saveToDatabase(DB);
            return newTask;
        }
        catch (error) {
            throw { status: 500, message: error.message };
        }
    },
    async updateTask(id, changedTask) {
        try {
            const isAlreadyAdded = DB.task.findIndex((task) => task.name === changedTask.name) > -1;
            if (isAlreadyAdded) {
                throw {
                    status: 400,
                    message: `Workout with the name '${changedTask.name}' already exists`,
                };
            }
            const taskIndex = await DB.task.findIndex((task) => task.id === id);
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
                };
                DB.task[taskIndex] = changedTask;
                await Utils.saveToDatabase(DB);
                return updatedTask;
            }
        }
        catch (error) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    },
    async deleteTask(id) {
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
        }
        catch (error) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    },
};
export default Task;
//# sourceMappingURL=taskDB.js.map