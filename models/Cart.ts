import mongoose, { Schema } from 'mongoose';
import { ICart, ICartItem } from '../types/Cart';

const CartItemSchema = new Schema<ICartItem>(
  {
    variant: {
      type: Schema.Types.ObjectId,
      ref: 'ProductVariant',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

CartSchema.pre('save', async function () {
  (this as ICart).updatedAt = new Date();
});

const Cart = mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
