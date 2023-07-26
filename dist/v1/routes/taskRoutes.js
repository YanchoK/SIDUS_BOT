import express from 'express';
import taskController from '../../controllers/taskController.js';
const router = express.Router();
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createNewTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);
export default router;
//# sourceMappingURL=taskRoutes.js.map