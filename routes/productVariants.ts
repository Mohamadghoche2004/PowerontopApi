import express from 'express';
import {
  getAllProductVariants,
  getProductVariant,
  createProductVariantHandler,
  updateProductVariantHandler,
  deleteProductVariantHandler,
} from '../controllers/productVariantController';

const router = express.Router();

router.get('/', getAllProductVariants);
router.get('/:id', getProductVariant);
router.post('/', createProductVariantHandler);
router.put('/:id', updateProductVariantHandler);
router.delete('/:id', deleteProductVariantHandler);

export default router;
