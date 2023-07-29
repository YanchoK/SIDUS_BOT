import express from 'express';
import TaskController from '../../controllers/taskController.js';
const router = express.Router();
const taskController = new TaskController();
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createNewTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
export default router;
//# sourceMappingURL=taskRoutes.js.map