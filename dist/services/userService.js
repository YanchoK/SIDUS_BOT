import User from "../database/userDB.js";
const UserService = {
    getAllUsers() {
        const allUsers = User.getAllUsers();
        return allUsers;
    },
    async getUserById() {
        return;
    },
    async updateUser() {
        return;
    },
    async deleteUser() {
        return;
    },
    async registerUser() {
        return;
    },
    async loginUser() {
        return;
    }
};
export default UserService;
//# sourceMappingURL=userService.js.map