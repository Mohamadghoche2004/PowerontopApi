import { Request, Response } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../services/orderService';

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await getOrders();
    res.status(200).json(orders);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch orders';
    res.status(500).json({ error: message });
  }
};

export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const order = await getOrderById(id);

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.status(200).json(order);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch order';
    res.status(400).json({ error: message });
  }
};

export const createOrderHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create order';
    res.status(400).json({ error: message });
  }
};

export const updateOrderHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const order = await updateOrder(id, req.body);
    res.status(200).json(order);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update order';
    if (message === 'Order not found') {
      res.status(404).json({ error: message });
    } else {
      res.status(400).json({ error: message });
    }
  }
};

export const deleteOrderHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await deleteOrder(id);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete order';
    if (message === 'Order not found') {
      res.status(404).json({ error: message });
    } else {
      res.status(400).json({ error: message });
    }
  }
};
