import express, { Router } from 'express';
import UserController from '../../controllers/userController.js';

const router: Router = express.Router();
const userController = new UserController();

// Define routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createNewUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
export default router;
