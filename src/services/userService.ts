import UserModel from "../models/userModel.js";
import { PrismaClient } from '@prisma/client'

export default class UserService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient()
    }

    async getAllUsers(): Promise<UserModel[]> {
        try {
            return await this.prisma.user.findMany() as UserModel[]
        } catch (error) {
            throw { status: 500, message: error };
        }
    }

    async getAllUsersInRange(page: number, limit: number) {
        try {
            const allUsersInRange = await this.prisma.user.findMany({
                skip: (page - 1) * limit,
                take: limit,
            });

            if (allUsersInRange.length === 0) {
                const usersCount = await this.prisma.user.count()
                throw { status: 500, message: `Number of elements exieded! Elements count: ${usersCount}.` };
            }

            return allUsersInRange;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(userId: number) {
        try {
            const user = await this.prisma.user.findFirstOrThrow({
                where: {
                    id: userId
                }
            });
            return user;
        } catch (error: any) {
            throw { status: error?.status || 500, message: `Can't find user with id ${userId}` || error };
        }
    }

    async createNewUser(newUser: UserModel) {
        try {
            const createdUser = await this.prisma.user.create({
                data: newUser
            })
            return createdUser;
        }
        catch (error: any) {
            throw { status: 500, message: error.message };
        }
    }

    async updateUser(userId: number, changedUser: UserModel) {
        try {
            await this.getUserById(userId);
            const updatedUser = await this.prisma.user.update({
                where: {
                    id: userId,
                },
                data: changedUser,
            })
            return updatedUser;
        } catch (error: any) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }

    async deleteUser(userId: number) {
        try {
            await this.getUserById(userId);
            await this.prisma.user.delete({
                where: {
                    id: userId
                }
            })
        } catch (error: any) {
            throw { status: error?.status || 500, message: error?.message || error };
        }
    }
}