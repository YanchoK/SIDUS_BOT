import express, { Router } from 'express';
import BotController from '../../controllers/botController.js';

const router: Router = express.Router();
const botController: BotController = new BotController();
// Define routes
router.get('/', botController.getAllBots);
router.get('/:id', botController.getBotById);
router.post('/', botController.createNewBot);
router.put('/:id', botController.updateBot);
router.delete('/:id', botController.deleteBot);
export default router;
