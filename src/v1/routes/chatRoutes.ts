import express, { Router } from 'express';
import ChatController from '../../controllers/chatController.js';

const router: Router = express.Router();
const chatController: ChatController = new ChatController();
// Define routes
router.get('/', chatController.getAllChats);
router.get('/:id', chatController.getChatById);
router.post('/', chatController.createNewChat);
router.put('/:id', chatController.updateChat);
router.delete('/:id', chatController.deleteChat);
export default router;
