import express from 'express';
import {
  getAllOrders,
  getOrder,
  createOrderHandler,
  updateOrderHandler,
  deleteOrderHandler,
} from '../controllers/orderController';

const router = express.Router();

router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.post('/', createOrderHandler);
router.put('/:id', updateOrderHandler);
router.delete('/:id', deleteOrderHandler);

export default router;
