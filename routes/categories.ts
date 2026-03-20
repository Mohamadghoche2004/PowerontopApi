import express from 'express';
import { getAllCategories, createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } from '../controllers/categoryController';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', createCategoryHandler);
router.put('/:id', updateCategoryHandler);
router.delete('/:id', deleteCategoryHandler);

export default router;
