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
    async getAllTasksInRange(startIndex, endIndex) {
        try {
            const allTasksInRange = await taskDB.getAllTasksInRange(startIndex, endIndex);
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
        let newId = 8;
        const taskToInsert = {
            id: newId,
            ...newTask
        };
        try {
            const createdTask = await taskDB.createNewTask(taskToInsert);
            return createdTask;
        }
        catch (error) {
            throw error;
        }
    },
    async updateTask(id, changedTask) {
        try {
            const updatedTask = await taskDB.updateTask(id, changedTask);
            return updatedTask;
        }
        catch (error) {
            throw error;
        }
    },
    async deleteTask(id) {
        try {
            taskDB.deleteTask(id);
        }
        catch (error) {
            throw error;
        }
    },
};
export default TaskService;
//# sourceMappingURL=taskService.js.map