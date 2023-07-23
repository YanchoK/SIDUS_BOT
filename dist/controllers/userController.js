import { PrismaClient } from "@prisma/client";
import userService from '../services/userService.js';
const prisma = new PrismaClient();
const UserController = {
    async getAllUsers(req, res) {
        try {
            const allUsers = userService.getAllUsers();
            res.status(200).json(allUsers);
        }
        catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving users.' });
        }
    },
    async getUserById(req, res) {
    },
    async updateUser(req, res) {
    },
    async deleteUser(req, res) {
    },
    registerUser(req, res) {
    },
    loginUser(req, res) {
    },
};
export default UserController;
//# sourceMappingURL=userController.js.map