import express from 'express';
import ChatController from '../../controllers/chatController.js';
const router = express.Router();
const chatController = new ChatController();
router.get('/', chatController.getAllChats);
router.get('/:id', chatController.getChatById);
router.post('/', chatController.createNewChat);
router.put('/:id', chatController.updateChat);
router.delete('/:id', chatController.deleteChat);
export default router;
//# sourceMappingURL=chatRoutes.js.map