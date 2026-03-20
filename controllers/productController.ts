import { Request, Response } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await getProducts();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch products' });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const product = await getProductById(id);
    
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    
    res.status(200).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to fetch product' });
  }
};

export const createProductHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create product' });
  }
};

export const updateProductHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const product = await updateProduct(id, req.body);
    res.status(200).json(product);
  } catch (error: any) {
    if (error.message === 'Product not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Failed to update product' });
    }
  }
};

export const deleteProductHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await deleteProduct(id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Product not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: error.message || 'Failed to delete product' });
    }
  }
};
