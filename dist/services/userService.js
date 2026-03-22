"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const passwordUtils_1 = require("../utils/passwordUtils");
const getUsers = async () => {
    const users = await User_1.default.find().select('-password').sort({ createdAt: -1 });
    return users.map(user => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    }));
};
exports.getUsers = getUsers;
const getUserById = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID');
    }
    const user = await User_1.default.findById(id).select('-password');
    if (!user) {
        return null;
    }
    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
};
exports.getUserById = getUserById;
const createUser = async (data) => {
    const { name, email, password, role = 'user' } = data;
    if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
    }
    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }
    if (role && !['user', 'admin'].includes(role)) {
        throw new Error('Role must be either "user" or "admin"');
    }
    // Check if user with same email already exists
    const existingUser = await User_1.default.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const hashedPassword = await (0, passwordUtils_1.hashPassword)(password);
    const user = new User_1.default({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
    });
    await user.save();
    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
};
exports.createUser = createUser;
const updateUser = async (id, data) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID');
    }
    const user = await User_1.default.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    // Validate role if provided
    if (data.role && !['user', 'admin'].includes(data.role)) {
        throw new Error('Role must be either "user" or "admin"');
    }
    // Validate password if provided
    if (data.password !== undefined && data.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }
    // Check email uniqueness if updating email
    if (data.email && data.email.toLowerCase() !== user.email) {
        const existingUser = await User_1.default.findOne({ email: data.email.toLowerCase(), _id: { $ne: id } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
    }
    // Update fields
    if (data.name !== undefined)
        user.name = data.name;
    if (data.email !== undefined)
        user.email = data.email.toLowerCase();
    if (data.role !== undefined)
        user.role = data.role;
    if (data.password !== undefined) {
        user.password = await (0, passwordUtils_1.hashPassword)(data.password);
    }
    await user.save();
    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID');
    }
    const user = await User_1.default.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    await User_1.default.findByIdAndDelete(id);
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userService.js.map