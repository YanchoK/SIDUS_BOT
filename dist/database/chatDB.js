import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const Chat = {
    async getAllChats() {
        try {
            return await prisma.chat.findMany();
        }
        catch (error) {
            throw { status: 500, message: error };
        }
    },
    async getAllChatsInRange(page, limit) {
        try {
            const allChatsInRange = await prisma.chat.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });
            if (allChatsInRange.length === 0) {
                const chatsCount = await prisma.chat.count();
                throw { status: 500, message: `Number of elements exieded! Elements count: ${chatsCount}.` };
            }
            return allChatsInRange;
        }
        catch (error) {
            throw error;
        }
    },
    async getChatById(chatId) {
        try {
            const chat = await prisma.chat.findFirstOrThrow({
                where: {
                    id: chatId
                }
            });
            return chat;
        }
        catch (error) {
            throw { status: error?.status || 500, message: `Can't find chat with id ${chatId}` || error };
        }
    },
    async createNewChat(newChat) {
        try {
            const createdChat = await prisma.chat.create({
                data: newChat
            });
            return createdChat;
        }
        catch (error) {
            throw { status: 500, message: error.message };
        }
    },
    async updateChat(chatId, changedChat) {
        try {
            await this.getChatById(chatId);
            const updatedChat = await prisma.chat.update({
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
    },
    async deleteChat(chatId) {
        try {
            await this.getChatById(chatId);
            await prisma.chat.delete({
                where: {
                    id: chatId
                }
            });
        }
        catch (error) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    },
};
export default Chat;
//# sourceMappingURL=chatDB.js.map