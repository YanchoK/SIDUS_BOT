import UserService from '../services/userService.js';
export default class UserController {
    userService;
    constructor() {
        this.userService = new UserService();
    }
    getAllUsers = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        let allUsers;
        try {
            if (!req.query.page && !req.query.limit) {
                allUsers = await this.userService.getAllUsers();
            }
            else {
                allUsers = await this.userService.getAllUsersInRange(page, limit);
            }
            res.status(200).send({ count: allUsers.length, users: allUsers });
        }
        catch (error) {
            res.status(500)
                .send({ status: "FAILED", data: { error: error.message } });
        }
    };
    getUserById = async (req, res) => {
        const { params: { id } } = req;
        try {
            const user = await this.userService.getUserById(parseInt(id));
            res.status(200).json(user);
        }
        catch (error) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    };
    createNewUser = async (req, res) => {
        const { email, password, firstName, lastName } = req.body;
        if (!email ||
            !password ||
            !firstName ||
            !lastName) {
            res.status(400).send({
                status: "400",
                data: {
                    error: "One of the following keys is missing or is empty in request body: 'name','url', 'user_id'",
                },
            });
            return;
        }
        else {
            const newUser = {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            };
            try {
                const createdUser = await this.userService.createNewUser(newUser);
                res.status(200).json({ message: "User is created", data: createdUser });
            }
            catch (error) {
                res.status(error?.status || 500)
                    .send({ status: "FAILED", data: { error: error?.message || error } });
            }
        }
    };
    updateUser = async (req, res) => {
        const { body, params: { id } } = req;
        try {
            const updatedUser = await this.userService.updateUser(parseInt(id), body);
            res.status(200).json({ message: "User is updated", data: updatedUser });
        }
        catch (error) {
            res.status(error?.status || 500).send({
                status: "FAILED",
                data: { error: error?.message || error }
            });
        }
    };
    deleteUser = async (req, res) => {
        const { params: { id } } = req;
        try {
            await this.userService.deleteUser(parseInt(id));
            res.status(200).json({ message: "User is deleted" });
        }
        catch (error) {
            res
                .status(error?.status || 500)
                .send({ status: "FAILED", data: { error: error?.message || error } });
        }
    };
}
//# sourceMappingURL=userController.js.map