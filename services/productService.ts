import Product from '../models/Product';
import Category from '../models/Category';
import ProductVariant from '../models/ProductVariant';
import mongoose from 'mongoose';
import { ICategory } from '../types/Category';

export interface CategoryInfo {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductResponse {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: CategoryInfo | string;
  images: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  isActive?: boolean;
}

export interface UpdateProductData {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  images?: string[];
  isActive?: boolean;
}

// Helper function to convert populated category to CategoryInfo
const convertCategoryToInfo = (category: ICategory | mongoose.Types.ObjectId | string | null | undefined): CategoryInfo | string => {
  if (!category) {
    return '';
  }
  
  if (typeof category === 'string') {
    return category;
  }
  
  if (category instanceof mongoose.Types.ObjectId) {
    return category.toString();
  }
  
  // Type guard to check if it's ICategory
  if ('_id' in category && 'name' in category && 'slug' in category) {
    return {
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
    };
  }
  
  return '';
};

export const getProducts = async (): Promise<ProductResponse[]> => {
  const products = await Product.find()
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });
  
  return products.map(product => ({
    _id: product._id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
    category: convertCategoryToInfo(product.category as ICategory | mongoose.Types.ObjectId),
    images: product.images,
    isActive: product.isActive,
    createdAt: product.createdAt,
  }));
};

export const getProductById = async (id: string): Promise<ProductResponse | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid product ID');
  }

  const product = await Product.findById(id).populate('category', 'name slug');
  
  if (!product) {
    return null;
  }

  return {
    _id: product._id.toString(),
    title: product.title,
    description: product.description,
    price: product.price,
    category: convertCategoryToInfo(product.category as ICategory | mongoose.Types.ObjectId),
    images: product.images,
    isActive: product.isActive,
    createdAt: product.createdAt,
  };
};

export const createProduct = async (data: CreateProductData): Promise<ProductResponse> => {
  const { title, description, price, category, images = [], isActive = true } = data;

  // Validate category exists
  if (!mongoose.Types.ObjectId.isValid(category)) {
    throw new Error('Invalid category ID');
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new Error('Category not found');
  }

  // Validate required fields
  if (!title || !description || price === undefined) {
    throw new Error('Title, description, and price are required');
  }

  if (price < 0) {
    throw new Error('Price must be a positive number');
  }

  const product = new Product({
    title,
    description,
    price,
    category,
    images,
    isActive,
  });

  await product.save();

  const populatedProduct = await Product.findById(product._id).populate<{ category: ICategory }>('category', 'name slug');

  return {
    _id: populatedProduct!._id.toString(),
    title: populatedProduct!.title,
    description: populatedProduct!.description,
    price: populatedProduct!.price,
    category: convertCategoryToInfo(populatedProduct!.category),
    images: populatedProduct!.images,
    isActive: populatedProduct!.isActive,
    createdAt: populatedProduct!.createdAt,
  };
};

export const updateProduct = async (id: string, data: UpdateProductData): Promise<ProductResponse> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid product ID');
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }

  // Validate category if provided
  if (data.category) {
    if (!mongoose.Types.ObjectId.isValid(data.category)) {
      throw new Error('Invalid category ID');
    }
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) {
      throw new Error('Category not found');
    }
  }

  // Validate price if provided
  if (data.price !== undefined && data.price < 0) {
    throw new Error('Price must be a positive number');
  }

  // Update fields
  if (data.title !== undefined) product.title = data.title;
  if (data.description !== undefined) product.description = data.description;
  if (data.price !== undefined) product.price = data.price;
  if (data.category !== undefined) {
    product.category = new mongoose.Types.ObjectId(data.category) as mongoose.Types.ObjectId;
  }
  if (data.images !== undefined) product.images = data.images;
  if (data.isActive !== undefined) product.isActive = data.isActive;

  await product.save();

  const populatedProduct = await Product.findById(product._id).populate<{ category: ICategory }>('category', 'name slug');

  return {
    _id: populatedProduct!._id.toString(),
    title: populatedProduct!.title,
    description: populatedProduct!.description,
    price: populatedProduct!.price,
    category: convertCategoryToInfo(populatedProduct!.category),
    images: populatedProduct!.images,
    isActive: populatedProduct!.isActive,
    createdAt: populatedProduct!.createdAt,
  };
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid product ID');
  }

  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }

  // Delete associated product variants
  await ProductVariant.deleteMany({ product: id });

  // Delete the product
  await Product.findByIdAndDelete(id);
};
