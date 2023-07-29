import ChatModel from "../models/chatModel.js";
import { PrismaClient } from '@prisma/client'

export default class ChatService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient()
    }

    async getAllChats(): Promise<ChatModel[]> {
        try {
            return await this.prisma.chat.findMany() as ChatModel[]
        } catch (error) {
            throw { status: 500, message: error };
        }
    }

    async getAllChatsInRange(page: number, limit: number) {
        try {
            const allChatsInRange = await this.prisma.chat.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });

            if (allChatsInRange.length === 0) {
                const chatsCount = await this.prisma.chat.count()
                throw { status: 500, message: `Number of elements exieded! Elements count: ${chatsCount}.` };
            }

            return allChatsInRange;
        } catch (error) {
            throw error;
        }
    }

    async getChatById(chatId: number) {
        try {
            const chat = await this.prisma.chat.findFirstOrThrow({
                where: {
                    id: chatId
                }
            });
            return chat;
        } catch (error: any) {
            throw { status: error?.status || 500, message: `Can't find chat with id ${chatId}` || error };
        }
    }

    async createNewChat(newChat: ChatModel) {
        try {
            const createdChat = await this.prisma.chat.create({
                data: newChat
            })
            return createdChat;
        }
        catch (error: any) {
            throw { status: 500, message: error.message };
        }
    }

    async updateChat(chatId: number, changedChat: ChatModel) {
        try {
            await this.getChatById(chatId);
            const updatedChat = await this.prisma.chat.update({
                where: {
                    id: chatId,
                },
                data: changedChat,
            })
            return updatedChat;
        } catch (error: any) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }

    async deleteChat(chatId: number) {
        try {
            await this.getChatById(chatId);
            await this.prisma.chat.delete({
                where: {
                    id: chatId
                }
            })
        } catch (error: any) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }
}