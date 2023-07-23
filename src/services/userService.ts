import User from "../database/User.js";

const UserService = {
     getAllUsers() {
        const allUsers=User.getAllUsers();
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
}

export default UserService