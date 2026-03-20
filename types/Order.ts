import mongoose, { Document } from 'mongoose';

export interface IGuestInfo {
  name: string;
  phone: string;
  address: string;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  guest?: IGuestInfo;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  totalAmount: number;
  shippingAddress: string;
  createdAt: Date;
}
