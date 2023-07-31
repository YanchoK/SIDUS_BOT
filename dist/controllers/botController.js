import BotService from '../services/botService.js';
export default class BotController {
    botService;
    constructor() {
        this.botService = new BotService();
    }
    getAllBots = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let allBots;
        try {
            if (!req.query.page && !req.query.limit) {
                allBots = await this.botService.getAllBots();
            }
            else {
                allBots = await this.botService.getAllBotsInRange(page, limit);
            }
            res.status(200).send({ count: allBots.length, bots: allBots });
        }
        catch (error) {
            res.status(500)
                .send({ status: "FAILED", data: { error: error.message } });
        }
    };
    getBotById = async (req, res) => {
        const { params: { id } } = req;
        try {
            const bot = await this.botService.getBotById(parseInt(id));
            res.status(200).json(bot);
        }
        catch (error) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    };
    createNewBot = async (req, res) => {
        const { email, password, name, user_id } = req.body;
        if (!email ||
            !password ||
            !name) {
            res.status(400).send({
                status: "400",
                data: {
                    error: "One of the following keys is missing or is empty in request body: 'name','url', 'user_id'",
                },
            });
            return;
        }
        else {
            const newBot = {
                email: email,
                password: password,
                name: name,
                user_id: user_id
            };
            try {
                const createdBot = await this.botService.createNewBot(newBot);
                res.status(200).json({ message: "Bot is created", data: createdBot });
            }
            catch (error) {
                res.status(error?.status || 500)
                    .send({ status: "FAILED", data: { error: error?.message || error } });
            }
        }
    };
    updateBot = async (req, res) => {
        const { body, params: { id } } = req;
        try {
            const updatedBot = await this.botService.updateBot(parseInt(id), body);
            res.status(200).json({ message: "Bot is updated", data: updatedBot });
        }
        catch (error) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    };
    deleteBot = async (req, res) => {
        const { params: { id } } = req;
        try {
            await this.botService.deleteBot(parseInt(id));
            res.status(200).json({ message: "Bot is deleted" });
        }
        catch (error) {
            res
                .status(error?.status || 500)
                .send({ status: "FAILED", data: { error: error?.message || error } });
        }
    };
}
//# sourceMappingURL=botController.js.map