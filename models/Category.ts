import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../types/Category';

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  }
);

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
