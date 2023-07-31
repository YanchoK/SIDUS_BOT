import { PrismaClient } from '@prisma/client';
export default class BotService {
    prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async getAllBots() {
        try {
            return await this.prisma.bot.findMany();
        }
        catch (error) {
            throw { status: 500, message: error };
        }
    }
    async getAllBotsInRange(page, limit) {
        try {
            const allBotsInRange = await this.prisma.bot.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });
            if (allBotsInRange.length === 0) {
                const botsCount = await this.prisma.bot.count();
                throw { status: 500, message: `Number of elements exieded! Elements count: ${botsCount}.` };
            }
            return allBotsInRange;
        }
        catch (error) {
            throw error;
        }
    }
    async getBotById(botId) {
        try {
            const bot = await this.prisma.bot.findFirstOrThrow({
                where: {
                    id: botId
                }
            });
            return bot;
        }
        catch (error) {
            throw { status: error?.status || 500, message: `Can't find bot with id ${botId}` || error };
        }
    }
    async createNewBot(newBot) {
        try {
            const createdBot = await this.prisma.bot.create({
                data: newBot
            });
            return createdBot;
        }
        catch (error) {
            throw { status: 500, message: error.message };
        }
    }
    async updateBot(botId, changedBot) {
        try {
            await this.getBotById(botId);
            const updatedBot = await this.prisma.bot.update({
                where: {
                    id: botId,
                },
                data: changedBot,
            });
            return updatedBot;
        }
        catch (error) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }
    async deleteBot(botId) {
        try {
            await this.getBotById(botId);
            await this.prisma.bot.delete({
                where: {
                    id: botId
                }
            });
        }
        catch (error) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }
}
//# sourceMappingURL=botService.js.map