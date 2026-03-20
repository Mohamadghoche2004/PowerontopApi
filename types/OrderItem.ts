import mongoose, { Document } from 'mongoose';

export interface IOrderItem extends Document {
  _id: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  productVariant: mongoose.Types.ObjectId;
  price: number;
  quantity: number;
}
