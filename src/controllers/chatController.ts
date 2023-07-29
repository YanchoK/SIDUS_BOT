import { Request, Response } from 'express';
import ChatService from '../services/chatService.js'
import ChatModel from '../models/chatModel.js';

export default class ChatController {
    private chatService: ChatService;

    constructor() {
        this.chatService = new ChatService();
        // this.getAllChats = this.getAllChats.bind(this);
    }

    getAllChats = async (req: Request, res: Response) => {
        const page: number = parseInt(req.query.page as string) || 1; // The requested page number
        const limit: number = parseInt(req.query.limit as string) || 10; // Number of items per page
        let allChats: any;
        // try {
        if (!req.query.page && !req.query.limit) {
            allChats = await this.chatService.getAllChats();
        }
        else {
            allChats = await this.chatService.getAllChatsInRange(page, limit);
        }
        res.status(200).send({ count: allChats.length, chats: allChats });
        // }
        // catch (error: any) {
        //     res.status(500)
        //         .send({ status: "FAILED", data: { error: error.message } });
        // }
    }

    getChatById = async (req: Request, res: Response) => {
        const { params: { id } } = req;
        try {
            const chat = await this.chatService.getChatById(parseInt(id))
            res.status(200).json(chat)
        } catch (error: any) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    }

    createNewChat = async (req: Request, res: Response) => {
        const { name, url, user_id } = req.body;
        if (
            !name ||
            !url
            //||!user_id
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
            const newChat: ChatModel = {
                name: name,
                url: url,
                user_id: user_id
            }
            try {
                const createdChat = await this.chatService.createNewChat(newChat)
                res.status(200).json({ message: "Chat is created", data: createdChat });
            }
            catch (error: any) {
                res.status(error?.status || 500)
                    .send({ status: "FAILED", data: { error: error?.message || error } });
            }
        }
    }

    updateChat = async (req: Request, res: Response) => {
        const { body, params: { id } } = req;
        try {
            const updatedChat = await this.chatService.updateChat(parseInt(id), body as ChatModel)
            res.status(200).json({ message: "Chat is updated", data: updatedChat });
        } catch (error: any) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    }

    deleteChat = async (req: Request, res: Response) => {
        const { params: { id } } = req;
        try {
            await this.chatService.deleteChat(parseInt(id))
            res.status(200).json({ message: "Chat is deleted" });
        } catch (error: any) {
            res
                .status(error?.status || 500)
                .send({ status: "FAILED", data: { error: error?.message || error } });
        }
    }
}