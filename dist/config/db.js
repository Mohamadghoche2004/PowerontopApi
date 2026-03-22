"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/powerontop';
const connectDB = async () => {
    if (process.env.VERCEL && !process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not set. Add it in Vercel: Project → Settings → Environment Variables.');
        return;
    }
    try {
        await mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        // Never process.exit() on Vercel — it kills the serverless function (500 FUNCTION_INVOCATION_FAILED).
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map