import mongoose, { Document } from 'mongoose';

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  isActive: boolean;
  createdAt: Date;
}
