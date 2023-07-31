import express from 'express';
import BotController from '../../controllers/botController.js';
const router = express.Router();
const botController = new BotController();
router.get('/', botController.getAllBots);
router.get('/:id', botController.getBotById);
router.post('/', botController.createNewBot);
router.put('/:id', botController.updateBot);
router.delete('/:id', botController.deleteBot);
export default router;
//# sourceMappingURL=botRoutes.js.map