import mongoose, { Schema } from 'mongoose';
import { IProductVariant } from '../types/ProductVariant';

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    size: {
      type: String,
      enum: ['S', 'M', 'L'],
      required: true,
    },
    color: {
      type: String,
      enum: ['Red', 'Black'],
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    extraPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  }
);

const ProductVariant = mongoose.model<IProductVariant>('ProductVariant', ProductVariantSchema);

export default ProductVariant;
