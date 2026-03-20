import Category from '../models/Category';
import Product from '../models/Product';
import mongoose from 'mongoose';

export interface CategoryResponse {
  _id: string;
  name: string;
  slug: string;
}

export interface CreateCategoryData {
  name: string;
  slug?: string;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
}

// Generate slug from name if not provided
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const getCategories = async (): Promise<CategoryResponse[]> => {
  const categories = await Category.find().sort({ name: 1 });
  
  return categories.map(category => ({
    _id: category._id.toString(),
    name: category.name,
    slug: category.slug,
  }));
};

export const createCategory = async (data: CreateCategoryData): Promise<CategoryResponse> => {
  const { name, slug } = data;

  // Validate required fields
  if (!name || !name.trim()) {
    throw new Error('Category name is required');
  }

  // Generate slug if not provided
  const categorySlug = slug ? slug.toLowerCase().trim() : generateSlug(name);

  if (!categorySlug) {
    throw new Error('Unable to generate a valid slug from the category name');
  }

  // Check if category with same slug already exists
  const existingCategory = await Category.findOne({ slug: categorySlug });
  if (existingCategory) {
    throw new Error('Category with this slug already exists');
  }

  const category = new Category({
    name: name.trim(),
    slug: categorySlug,
  });

  await category.save();

  return {
    _id: category._id.toString(),
    name: category.name,
    slug: category.slug,
  };
};

export const updateCategory = async (id: string, data: UpdateCategoryData): Promise<CategoryResponse> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid category ID');
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }

  // Update name if provided
  if (data.name !== undefined) {
    if (!data.name.trim()) {
      throw new Error('Category name cannot be empty');
    }
    category.name = data.name.trim();
  }

  // Update slug if provided, or regenerate from name if name was updated
  if (data.slug !== undefined) {
    const newSlug = data.slug.toLowerCase().trim();
    if (!newSlug) {
      throw new Error('Category slug cannot be empty');
    }
    
    // Check if slug already exists for a different category
    const existingCategory = await Category.findOne({ slug: newSlug, _id: { $ne: id } });
    if (existingCategory) {
      throw new Error('Category with this slug already exists');
    }
    
    category.slug = newSlug;
  } else if (data.name !== undefined) {
    // Regenerate slug from new name if name was updated but slug wasn't
    const newSlug = generateSlug(category.name);
    if (!newSlug) {
      throw new Error('Unable to generate a valid slug from the category name');
    }
    
    // Check if generated slug already exists for a different category
    const existingCategory = await Category.findOne({ slug: newSlug, _id: { $ne: id } });
    if (existingCategory) {
      throw new Error('Category with this generated slug already exists');
    }
    
    category.slug = newSlug;
  }

  await category.save();

  return {
    _id: category._id.toString(),
    name: category.name,
    slug: category.slug,
  };
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid category ID');
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }

  // Check if any products are using this category
  const productsCount = await Product.countDocuments({ category: id });
  if (productsCount > 0) {
    throw new Error(`Cannot delete category: ${productsCount} product(s) are using this category`);
  }

  // Delete the category
  await Category.findByIdAndDelete(id);
};
