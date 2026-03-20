import express from 'express';
import {
  getAllProducts,
  getProduct,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
} from '../controllers/productController';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.post('/', createProductHandler);
router.put('/:id', updateProductHandler);
router.delete('/:id', deleteProductHandler);

export default router;
