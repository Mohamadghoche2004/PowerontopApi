import mongoose, { Document } from 'mongoose';

export interface IProductVariant extends Document {
  _id: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  size: 'S' | 'M' | 'L';
  color: 'Red' | 'Black';
  sku: string;
  stock: number;
  extraPrice: number;
}
