"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserHandler = exports.updateUserHandler = exports.createUserHandler = exports.getUser = exports.getAllUsers = void 0;
const userService_1 = require("../services/userService");
const getAllUsers = async (req, res) => {
    try {
        const users = await (0, userService_1.getUsers)();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch users' });
    }
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        const user = await (0, userService_1.getUserById)(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Failed to fetch user' });
    }
};
exports.getUser = getUser;
const createUserHandler = async (req, res) => {
    try {
        const user = await (0, userService_1.createUser)(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Failed to create user' });
    }
};
exports.createUserHandler = createUserHandler;
const updateUserHandler = async (req, res) => {
    try {
        const id = String(req.params.id);
        const user = await (0, userService_1.updateUser)(id, req.body);
        res.status(200).json(user);
    }
    catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: error.message || 'Failed to update user' });
        }
    }
};
exports.updateUserHandler = updateUserHandler;
const deleteUserHandler = async (req, res) => {
    try {
        const id = String(req.params.id);
        await (0, userService_1.deleteUser)(id);
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        if (error.message === 'User not found') {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: error.message || 'Failed to delete user' });
        }
    }
};
exports.deleteUserHandler = deleteUserHandler;
//# sourceMappingURL=userController.js.map