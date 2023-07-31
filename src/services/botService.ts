import BotModel from "../models/botModel.js";
import { PrismaClient } from '@prisma/client'

export default class BotService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient()
    }

    async getAllBots(): Promise<BotModel[]> {
        try {
            return await this.prisma.bot.findMany() as BotModel[]
        } catch (error) {
            throw { status: 500, message: error };
        }
    }

    async getAllBotsInRange(page: number, limit: number) {
        try {
            const allBotsInRange = await this.prisma.bot.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });

            if (allBotsInRange.length === 0) {
                const botsCount = await this.prisma.bot.count()
                throw { status: 500, message: `Number of elements exieded! Elements count: ${botsCount}.` };
            }

            return allBotsInRange;
        } catch (error) {
            throw error;
        }
    }

    async getBotById(botId: number) {
        try {
            const bot = await this.prisma.bot.findFirstOrThrow({
                where: {
                    id: botId
                }
            });
            return bot;
        } catch (error: any) {
            throw { status: error?.status || 500, message: `Can't find bot with id ${botId}` || error };
        }
    }

    async createNewBot(newBot: BotModel) {
        try {
            const createdBot = await this.prisma.bot.create({
                data: newBot
            })
            return createdBot;
        }
        catch (error: any) {
            throw { status: 500, message: error.message };
        }
    }

    async updateBot(botId: number, changedBot: BotModel) {
        try {
            await this.getBotById(botId);
            const updatedBot = await this.prisma.bot.update({
                where: {
                    id: botId,
                },
                data: changedBot,
            })
            return updatedBot;
        } catch (error: any) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }

    async deleteBot(botId: number) {
        try {
            await this.getBotById(botId);
            await this.prisma.bot.delete({
                where: {
                    id: botId
                }
            })
        } catch (error: any) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }
}