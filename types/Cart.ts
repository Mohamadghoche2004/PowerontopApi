import mongoose, { Document } from 'mongoose';

export interface ICartItem {
  variant: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}
