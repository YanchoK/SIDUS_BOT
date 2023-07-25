import taskDB from "../database/taskDB.js";
const UserService = {
    async getAllTasks() {
        try {
            const allUsers = await taskDB.getAllTasks();
            return allUsers;
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
export default UserService;
//# sourceMappingURL=taskService.js.map