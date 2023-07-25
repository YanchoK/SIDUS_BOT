import taskDB from "../database/taskDB.js";
let newId = 6;
const UserService = {
    async getAllTasks() {
        const allUsers = await taskDB.getAllTasks();
        return allUsers;
    },
    async getTaskById(id) {
        const task = await taskDB.getTaskById(id);
        return task;
    },
    async createNewTask(newTask) {
        const taskToInsert = {
            ...newTask,
            id: newId++
        };
        const createdTask = await taskDB.createNewTask(taskToInsert);
        return createdTask;
    },
    async updateTask(id, changedTask) {
        const updatedTask = await taskDB.updateTask(id, changedTask);
        return updatedTask;
    },
    async deleteTask(id) {
        taskDB.deleteTask(id);
    },
};
export default UserService;
//# sourceMappingURL=taskService.js.map