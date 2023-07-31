import { PrismaClient } from '@prisma/client';
export default class UserService {
    prisma;
    constructor() {
        this.prisma = new PrismaClient();
    }
    async getAllUsers() {
        try {
            return await this.prisma.user.findMany();
        }
        catch (error) {
            throw { status: 500, message: error };
        }
    }
    async getAllUsersInRange(page, limit) {
        try {
            const allUsersInRange = await this.prisma.user.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });
            if (allUsersInRange.length === 0) {
                const usersCount = await this.prisma.user.count();
                throw { status: 500, message: `Number of elements exieded! Elements count: ${usersCount}.` };
            }
            return allUsersInRange;
        }
        catch (error) {
            throw error;
        }
    }
    async getUserById(userId) {
        try {
            const user = await this.prisma.user.findFirstOrThrow({
                where: {
                    id: userId
                }
            });
            return user;
        }
        catch (error) {
            throw { status: error?.status || 500, message: `Can't find user with id ${userId}` || error };
        }
    }
    async createNewUser(newUser) {
        try {
            const createdUser = await this.prisma.user.create({
                data: newUser
            });
            return createdUser;
        }
        catch (error) {
            throw { status: 500, message: error.message };
        }
    }
    async updateUser(userId, changedUser) {
        try {
            await this.getUserById(userId);
            const updatedUser = await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: changedUser,
            });
            return updatedUser;
        }
        catch (error) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }
    async deleteUser(userId) {
        try {
            await this.getUserById(userId);
            await this.prisma.user.delete({
                where: {
                    id: userId
                }
            });
        }
        catch (error) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }
}
//# sourceMappingURL=userService.js.map