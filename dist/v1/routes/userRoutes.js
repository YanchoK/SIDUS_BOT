import express from 'express';
import UserController from '../../controllers/userController.js';
const router = express.Router();
const userController = new UserController();
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createNewUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
export default router;
//# sourceMappingURL=userRoutes.js.map