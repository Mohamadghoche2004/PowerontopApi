import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/powerontop';

export const connectDB = async (): Promise<void> => {
  if (process.env.VERCEL && !process.env.MONGODB_URI) {
    console.error(
      'MONGODB_URI is not set. Add it in Vercel: Project → Settings → Environment Variables.'
    );
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Never process.exit() on Vercel — it kills the serverless function (500 FUNCTION_INVOCATION_FAILED).
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};
