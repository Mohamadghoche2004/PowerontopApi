"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const passwordUtils_1 = require("../utils/passwordUtils");
const jwtUtils_1 = require("../utils/jwtUtils");
const registerUser = async (data) => {
    const { name, email, password } = data;
    // Check if user already exists
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    // Hash password
    const hashedPassword = await (0, passwordUtils_1.hashPassword)(password);
    // Create user
    const user = new User_1.default({
        name,
        email,
        password: hashedPassword,
        role: 'user',
    });
    await user.save();
    // Generate token
    const token = (0, jwtUtils_1.generateToken)({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    return {
        user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const { email, password } = data;
    // Find user
    const user = await User_1.default.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }
    // Verify password
    const isPasswordValid = await (0, passwordUtils_1.comparePassword)(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }
    // Generate token
    const token = (0, jwtUtils_1.generateToken)({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    return {
        user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
};
exports.loginUser = loginUser;
//# sourceMappingURL=authService.js.map