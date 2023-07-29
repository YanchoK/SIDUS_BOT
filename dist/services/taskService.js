import { PrismaClient } from '@prisma/client';
export default class TaskService {
    prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async getAllTasks() {
        try {
            return await this.prisma.task.findMany();
        }
        catch (error) {
            throw { status: 500, message: error };
        }
    }
    async getAllTasksInRange(page, limit) {
        try {
            const allTasksInRange = await this.prisma.task.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });
            if (allTasksInRange.length === 0) {
                const tasksCount = await this.prisma.task.count();
                throw { status: 500, message: `Number of elements exieded! Elements count: ${tasksCount}.` };
            }
            return allTasksInRange;
        }
        catch (error) {
            throw error;
        }
    }
    async getTaskById(taskId) {
        try {
            const task = await this.prisma.task.findFirstOrThrow({
                where: {
                    id: taskId
                }
            });
            return task;
        }
        catch (error) {
            throw { status: error?.status || 500, message: `Can't find task with id ${taskId}` || error };
        }
    }
    async createNewTask(newTask) {
        try {
            const createdTask = await this.prisma.task.create({
                data: newTask
            });
            return createdTask;
        }
        catch (error) {
            throw { status: 500, message: error.message };
        }
    }
    async updateTask(taskId, changedTask) {
        try {
            await this.getTaskById(taskId);
            const updatedTask = await this.prisma.task.update({
                where: {
                    id: taskId,
                },
                data: changedTask,
            });
            return updatedTask;
        }
        catch (error) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }
    async deleteTask(taskId) {
        try {
            await this.getTaskById(taskId);
            await this.prisma.task.delete({
                where: {
                    id: taskId
                }
            });
        }
        catch (error) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }
}
//# sourceMappingURL=taskService.js.map