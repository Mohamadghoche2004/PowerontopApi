"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderHandler = exports.updateOrderHandler = exports.createOrderHandler = exports.getOrder = exports.getAllOrders = void 0;
const orderService_1 = require("../services/orderService");
const getAllOrders = async (req, res) => {
    try {
        const orders = await (0, orderService_1.getOrders)();
        res.status(200).json(orders);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch orders';
        res.status(500).json({ error: message });
    }
};
exports.getAllOrders = getAllOrders;
const getOrder = async (req, res) => {
    try {
        const id = String(req.params.id);
        const order = await (0, orderService_1.getOrderById)(id);
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.status(200).json(order);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch order';
        res.status(400).json({ error: message });
    }
};
exports.getOrder = getOrder;
const createOrderHandler = async (req, res) => {
    try {
        const order = await (0, orderService_1.createOrder)(req.body);
        res.status(201).json(order);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create order';
        res.status(400).json({ error: message });
    }
};
exports.createOrderHandler = createOrderHandler;
const updateOrderHandler = async (req, res) => {
    try {
        const id = String(req.params.id);
        const order = await (0, orderService_1.updateOrder)(id, req.body);
        res.status(200).json(order);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update order';
        if (message === 'Order not found') {
            res.status(404).json({ error: message });
        }
        else {
            res.status(400).json({ error: message });
        }
    }
};
exports.updateOrderHandler = updateOrderHandler;
const deleteOrderHandler = async (req, res) => {
    try {
        const id = String(req.params.id);
        await (0, orderService_1.deleteOrder)(id);
        res.status(200).json({ message: 'Order deleted successfully' });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete order';
        if (message === 'Order not found') {
            res.status(404).json({ error: message });
        }
        else {
            res.status(400).json({ error: message });
        }
    }
};
exports.deleteOrderHandler = deleteOrderHandler;
//# sourceMappingURL=orderController.js.map