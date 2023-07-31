import ChatService from '../services/chatService.js';
export default class ChatController {
    chatService;
    constructor() {
        this.chatService = new ChatService();
    }
    getAllChats = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let allChats;
        try {
            if (!req.query.page && !req.query.limit) {
                allChats = await this.chatService.getAllChats();
            }
            else {
                allChats = await this.chatService.getAllChatsInRange(page, limit);
            }
            res.status(200).send({ count: allChats.length, chats: allChats });
        }
        catch (error) {
            res.status(500)
                .send({ status: "FAILED", data: { error: error.message } });
        }
    };
    getChatById = async (req, res) => {
        const { params: { id } } = req;
        try {
            const chat = await this.chatService.getChatById(parseInt(id));
            res.status(200).json(chat);
        }
        catch (error) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    };
    createNewChat = async (req, res) => {
        const { name, url, user_id } = req.body;
        if (!name ||
            !url) {
            res.status(400).send({
                status: "400",
                data: {
                    error: "One of the following keys is missing or is empty in request body: 'name','url', 'user_id'",
                },
            });
            return;
        }
        else {
            const newChat = {
                name: name,
                url: url,
                user_id: user_id
            };
            try {
                const createdChat = await this.chatService.createNewChat(newChat);
                res.status(200).json({ message: "Chat is created", data: createdChat });
            }
            catch (error) {
                res.status(error?.status || 500)
                    .send({ status: "FAILED", data: { error: error?.message || error } });
            }
        }
    };
    updateChat = async (req, res) => {
        const { body, params: { id } } = req;
        try {
            const updatedChat = await this.chatService.updateChat(parseInt(id), body);
            res.status(200).json({ message: "Chat is updated", data: updatedChat });
        }
        catch (error) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    };
    deleteChat = async (req, res) => {
        const { params: { id } } = req;
        try {
            await this.chatService.deleteChat(parseInt(id));
            res.status(200).json({ message: "Chat is deleted" });
        }
        catch (error) {
            res
                .status(error?.status || 500)
                .send({ status: "FAILED", data: { error: error?.message || error } });
        }
    };
}
//# sourceMappingURL=chatController.js.map