import { Request, Response } from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch categories' });
  }
};

export const createCategoryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await createCategory(req.body);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create category' });
  }
};

export const updateCategoryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const category = await updateCategory(id, req.body);
    res.status(200).json(category);
  } catch (error: any) {
    if (error.message === 'Category not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Failed to update category' });
    }
  }
};

export const deleteCategoryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await deleteCategory(id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Category not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Failed to delete category' });
    }
  }
};
