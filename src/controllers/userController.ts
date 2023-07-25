import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import UserModel from '../models/userModel.js';
import userService from '../services/userService.js'
const prisma = new PrismaClient()

//TODO: change from await prisma.message. to await prisma.account but need first to change the db.
const UserController = {
  async getAllUsers(req: Request, res: Response) {
    
    try {
      const allUsers = userService.getAllUsers();
      res.status(200).json(allUsers);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while retrieving users.' });
    }

    // try {
    //   const users = await prisma.message.findMany();
    //   res.status(200).json(users);
    // } catch (error) {
    //   res.status(500).json({ error: 'An error occurred while retrieving users.' });
    // }
  },

  //TODO: change from await prisma.message. to await prisma.account but need first to change the db.
  async getUserById(req: Request, res: Response) {
    // try {
    //   let { id } = req.params
    //   const user = await prisma.message.findUnique({
    //     where: { id: Number(id) }
    //   });

    //   if (user) {
    //     res.status(200).json(user);
    //   } else {
    //     res.status(404).json({ error: 'User not found' });
    //   }

    // } catch (error) {
    //   res.status(500).json({ error: 'An error occurred while retrieving users.' });
    // }
  },

  async updateUser(req: Request, res: Response) {
    // const { id } = req.params;
    // const { name, email } = req.body;

    // try {
    //   const updatedUser = await prisma.user.update({
    //     where: { id: Number(id) },
    //     data: { email },
    //   });

    //   res.status(200).json(updatedUser);
    // } catch (error) {
    //   res.status(500).json({ error: 'An error occurred while updating the user.' });
    // }
  },

  async deleteUser(req: Request, res: Response) {
    // const { id } = req.params;

    // try {
    //   await prisma.user.delete({
    //     where: { id: Number(id) },
    //   });

    //   res.status(204).send();
    // } catch (error) {
    //   res.status(500).json({ error: 'An error occurred while deleting the user.' });
    // }
  },
  
  registerUser(req: Request, res: Response) {
    // Extract user registration details from request body
    // const { username, email, password, type } = req.body;

    // // Perform user registration logic (e.g., create user in the database)

    // // Return success response
    // res.status(200).json({ message: 'User registered successfully' });
  },

  // User Login
  loginUser(req: Request, res: Response) {
    // Extract user login details from request body
    // const { email, password } = req.body;

    // Perform user login logic (e.g., validate credentials, generate JWT)

    // Return token in response
    // res.status(200).json({ token: 'your_token_here' });
  },
};

export default UserController;
