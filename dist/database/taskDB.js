import DB from "./db.json";
import Utils from "./utils.js";
const Task = {
    getAllTasks() {
        return DB.task;
    },
    async getTaskById(id) {
        return DB.task.find((task) => task.id === id);
    },
    async createNewTask(newTask) {
        const isAlreadyAdded = await DB.task.findIndex((task) => task.name === newTask.name) > -1;
        if (!isAlreadyAdded) {
            await DB.task.push(newTask);
            await Utils.saveToDatabase(DB);
            return newTask;
        }
        return;
    },
    async updateTask(id, changedTask) {
        const taskIndex = await DB.task.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
            const updatedTask = {
                ...DB.task[taskIndex],
                ...changedTask,
            };
            DB.task[taskIndex] = changedTask;
            await Utils.saveToDatabase(DB);
            return updatedTask;
        }
        return;
    },
    async deleteTask(id) {
        const taskIndex = await DB.task.findIndex((task) => task.id === id);
        await DB.task.splice(taskIndex, 1);
        await Utils.saveToDatabase(DB);
    },
};
export default Task;
//# sourceMappingURL=taskDB.js.map