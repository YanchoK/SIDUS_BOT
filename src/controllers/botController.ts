import { Request, Response } from 'express';
import BotService from '../services/botService.js'
import BotModel from '../models/botModel.js';

export default class BotController {
    private botService: BotService;

    constructor() {
        this.botService = new BotService();
        // this.getAllBots = this.getAllBots.bind(this);
    }

    getAllBots = async (req: Request, res: Response) => {
        const page: number = parseInt(req.query.page as string) || 1; // The requested page number
        const limit: number = parseInt(req.query.limit as string) || 10; // Number of items per page
        let allBots: any;
        try {
            if (!req.query.page && !req.query.limit) {
                allBots = await this.botService.getAllBots();
            }
            else {
                allBots = await this.botService.getAllBotsInRange(page, limit);
            }
            res.status(200).send({ count: allBots.length, bots: allBots });
        }
        catch (error: any) {
            res.status(500)
                .send({ status: "FAILED", data: { error: error.message } });
        }
    }

    getBotById = async (req: Request, res: Response) => {
        const { params: { id } } = req;
        try {
            const bot = await this.botService.getBotById(parseInt(id))
            res.status(200).json(bot)
        } catch (error: any) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    }

    createNewBot = async (req: Request, res: Response) => {
        const { email, password, name, user_id } = req.body;
        if (
            !email ||
            !password ||
            !name
            //||!user_id
        ) {
            res.status(400).send({
                status: "400",
                data: {
                    error:
                        "One of the following keys is missing or is empty in request body: 'name','url', 'user_id'",
                },
            });
            return;
        } else {
            const newBot: BotModel = {
                email: email,
                password: password,
                name: name,
                user_id: user_id
            }
            try {
                const createdBot = await this.botService.createNewBot(newBot)
                res.status(200).json({ message: "Bot is created", data: createdBot });
            }
            catch (error: any) {
                res.status(error?.status || 500)
                    .send({ status: "FAILED", data: { error: error?.message || error } });
            }
        }
    }

    updateBot = async (req: Request, res: Response) => {
        const { body, params: { id } } = req;
        try {
            const updatedBot = await this.botService.updateBot(parseInt(id), body as BotModel)
            res.status(200).json({ message: "Bot is updated", data: updatedBot });
        } catch (error: any) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    }

    deleteBot = async (req: Request, res: Response) => {
        const { params: { id } } = req;
        try {
            await this.botService.deleteBot(parseInt(id))
            res.status(200).json({ message: "Bot is deleted" });
        } catch (error: any) {
            res
                .status(error?.status || 500)
                .send({ status: "FAILED", data: { error: error?.message || error } });
        }
    }
}