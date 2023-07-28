import taskDB from "../database/taskDB.js";
const TaskService = {
    async getAllTasks() {
        try {
            const allTasks = await taskDB.getAllTasks();
            return allTasks;
        }
        catch (error) {
            throw error;
        }
    },
    async getAllTasksInRange(page, limit) {
        try {
            const allTasksInRange = await taskDB.getAllTasksInRange(page, limit);
            return allTasksInRange;
        }
        catch (error) {
            throw error;
        }
    },
    async getTaskById(id) {
        try {
            const task = await taskDB.getTaskById(id);
            return task;
        }
        catch (error) {
            throw error;
        }
    },
    async createNewTask(newTask) {
        try {
            const createdTask = await taskDB.createNewTask(newTask);
            return createdTask;
        }
        catch (error) {
            throw error;
        }
    },
    async updateTask(id, changedTask) {
        try {
            changedTask.updatedAt = new Date();
            const updatedTask = await taskDB.updateTask(id, changedTask);
            return updatedTask;
        }
        catch (error) {
            throw error;
        }
    },
    async deleteTask(id) {
        try {
            await taskDB.deleteTask(id);
        }
        catch (error) {
            throw error;
        }
    },
};
export default TaskService;
//# sourceMappingURL=taskService.js.map