import express from 'express';
import userController from '../../controllers/userController.js';
const router = express.Router();
router.get('/', userController.getAllUsers);
router.get('/:userId', userController.getUserById);
router.put('/:userId', userController.updateUser);
router.delete('/:userId', userController.deleteUser);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
export default router;
//# sourceMappingURL=userRoutes.js.map