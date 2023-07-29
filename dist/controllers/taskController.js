import TaskService from '../services/taskService.js';
export default class TaskController {
    taskService;
    constructor() {
        this.taskService = new TaskService();
    }
    getAllTasks = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let allTasks;
        try {
            if (!req.query.page && !req.query.limit) {
                allTasks = await this.taskService.getAllTasks();
            }
            else {
                allTasks = await this.taskService.getAllTasksInRange(page, limit);
            }
            res.status(200).send({ count: allTasks.length, tasks: allTasks });
        }
        catch (error) {
            res.status(500)
                .send({ status: "FAILED", data: { error: error.message } });
        }
    };
    getTaskById = async (req, res) => {
        const { params: { id } } = req;
        try {
            const task = await this.taskService.getTaskById(parseInt(id));
            res.status(200).json(task);
        }
        catch (error) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    };
    createNewTask = async (req, res) => {
        const { title, content, chatUrl_id, bot_id, user_id, remindTime, recurring, sent, updatedAt } = req.body;
        if (!title ||
            !content ||
            !chatUrl_id ||
            !bot_id) {
            res.status(400).send({
                status: "400",
                data: {
                    error: "One of the following keys is missing or is empty in request body: 'title', 'content', 'chatUrl_id', 'bot_id', 'user_id'",
                },
            });
            return;
        }
        else {
            const newTask = {
                title: title,
                content: content,
                bot_id: bot_id,
                chatUrl_id: chatUrl_id,
                user_id: user_id,
                remindTime: remindTime,
                recurring: recurring,
                sent: sent,
                updatedAt: updatedAt
            };
            try {
                const createdTask = await this.taskService.createNewTask(newTask);
                res.status(200).json({ message: "Task is created", data: createdTask });
            }
            catch (error) {
                res.status(error?.status || 500)
                    .send({ status: "FAILED", data: { error: error?.message || error } });
            }
        }
    };
    updateTask = async (req, res) => {
        const { body, params: { id } } = req;
        try {
            const updatedTask = await this.taskService.updateTask(parseInt(id), body);
            res.status(200).json({ message: "Task is updated", data: updatedTask });
        }
        catch (error) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    };
    deleteTask = async (req, res) => {
        const { params: { id } } = req;
        try {
            await this.taskService.deleteTask(parseInt(id));
            res.status(200).json({ message: "Task is deleted" });
        }
        catch (error) {
            res
                .status(error?.status || 500)
                .send({ status: "FAILED", data: { error: error?.message || error } });
        }
    };
}
//# sourceMappingURL=taskController.js.map