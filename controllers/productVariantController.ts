import { Request, Response } from 'express';
import {
  getProductVariants,
  getProductVariantById,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from '../services/productVariantService';

export const getAllProductVariants = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.query.productId ? String(req.query.productId) : undefined;
    const variants = await getProductVariants(productId);
    res.status(200).json(variants);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch product variants';
    res.status(500).json({ error: message });
  }
};

export const getProductVariant = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const variant = await getProductVariantById(id);

    if (!variant) {
      res.status(404).json({ error: 'Product variant not found' });
      return;
    }

    res.status(200).json(variant);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch product variant';
    res.status(400).json({ error: message });
  }
};

export const createProductVariantHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const variant = await createProductVariant(req.body);
    res.status(201).json(variant);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create product variant';
    res.status(400).json({ error: message });
  }
};

export const updateProductVariantHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const variant = await updateProductVariant(id, req.body);
    res.status(200).json(variant);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update product variant';
    if (message === 'Product variant not found') {
      res.status(404).json({ error: message });
    } else {
      res.status(400).json({ error: message });
    }
  }
};

export const deleteProductVariantHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await deleteProductVariant(id);
    res.status(200).json({ message: 'Product variant deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete product variant';
    if (message === 'Product variant not found') {
      res.status(404).json({ error: message });
    } else {
      res.status(400).json({ error: message });
    }
  }
};
