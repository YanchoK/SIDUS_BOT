import { PrismaClient } from '@prisma/client';
export default class ChatService {
    prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async getAllChats() {
        try {
            return await this.prisma.chat.findMany();
        }
        catch (error) {
            throw { status: 500, message: error };
        }
    }
    async getAllChatsInRange(page, limit) {
        try {
            const allChatsInRange = await this.prisma.chat.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });
            if (allChatsInRange.length === 0) {
                const chatsCount = await this.prisma.chat.count();
                throw { status: 500, message: `Number of elements exieded! Elements count: ${chatsCount}.` };
            }
            return allChatsInRange;
        }
        catch (error) {
            throw error;
        }
    }
    async getChatById(chatId) {
        try {
            const chat = await this.prisma.chat.findFirstOrThrow({
                where: {
                    id: chatId
                }
            });
            return chat;
        }
        catch (error) {
            throw { status: error?.status || 500, message: `Can't find chat with id ${chatId}` || error };
        }
    }
    async createNewChat(newChat) {
        try {
            const createdChat = await this.prisma.chat.create({
                data: newChat
            });
            return createdChat;
        }
        catch (error) {
            throw { status: 500, message: error.message };
        }
    }
    async updateChat(chatId, changedChat) {
        try {
            await this.getChatById(chatId);
            const updatedChat = await this.prisma.chat.update({
                where: {
                    id: chatId,
                },
                data: changedChat,
            });
            return updatedChat;
        }
        catch (error) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }
    async deleteChat(chatId) {
        try {
            await this.getChatById(chatId);
            await this.prisma.chat.delete({
                where: {
                    id: chatId
                }
            });
        }
        catch (error) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }
}
//# sourceMappingURL=chatService.js.map