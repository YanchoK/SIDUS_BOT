import { Request, Response } from 'express';
import UserService from '../services/userService.js'
import UserModel from '../models/userModel.js';

export default class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
        // this.getAllUsers = this.getAllUsers.bind(this);
    }

    getAllUsers = async (req: Request, res: Response) => {
        const page: number = parseInt(req.query.page as string) || 1; // The requested page number
        const limit: number = parseInt(req.query.limit as string) || 10; // Number of items per page
        let allUsers: any;
        try {
            if (!req.query.page && !req.query.limit) {
                allUsers = await this.userService.getAllUsers();
            }
            else {
                allUsers = await this.userService.getAllUsersInRange(page, limit);
            }
            res.status(200).send({ count: allUsers.length, users: allUsers });
        }
        catch (error: any) {
            res.status(500)
                .send({ status: "FAILED", data: { error: error.message } });
        }
    }

    getUserById = async (req: Request, res: Response) => {
        const { params: { id } } = req;
        try {
            const user = await this.userService.getUserById(parseInt(id))
            res.status(200).json(user)
        } catch (error: any) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    }

    createNewUser = async (req: Request, res: Response) => {
        const { email, password, firstName, lastName } = req.body;
        if (
            !email ||
            !password ||
            !firstName ||
            !lastName
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
            const newUser: UserModel = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            }
            try {
                const createdUser = await this.userService.createNewUser(newUser)
                res.status(200).json({ message: "User is created", data: createdUser });
            }
            catch (error: any) {
                res.status(error?.status || 500)
                    .send({ status: "FAILED", data: { error: error?.message || error } });
            }
        }
    }

    updateUser = async (req: Request, res: Response) => {
        const { body, params: { id } } = req;
        try {
            const updatedUser = await this.userService.updateUser(parseInt(id), body as UserModel)
            res.status(200).json({ message: "User is updated", data: updatedUser });
        } catch (error: any) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    }

    deleteUser = async (req: Request, res: Response) => {
        const { params: { id } } = req;
        try {
            await this.userService.deleteUser(parseInt(id))
            res.status(200).json({ message: "User is deleted" });
        } catch (error: any) {
            res
                .status(error?.status || 500)
                .send({ status: "FAILED", data: { error: error?.message || error } });
        }
    }
}