"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrderById = exports.getOrders = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const OrderItem_1 = __importDefault(require("../models/OrderItem"));
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const ProductVariant_1 = __importDefault(require("../models/ProductVariant"));
const mongoose_1 = __importDefault(require("mongoose"));
// Helper to convert populated user to UserInfo
const convertUserToInfo = (user) => {
    if (!user)
        return '';
    if (typeof user === 'string')
        return user;
    if (user instanceof mongoose_1.default.Types.ObjectId)
        return user.toString();
    if ('_id' in user && 'name' in user && 'email' in user) {
        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
        };
    }
    return '';
};
// Helper to convert populated order items to response format
const convertOrderItems = (items) => {
    return items.map(item => {
        const product = item.product;
        const variant = item.productVariant;
        return {
            _id: String(item._id),
            product: product && typeof product === 'object' && product._id
                ? { _id: String(product._id), title: String(product.title) }
                : { _id: String(item.product), title: '' },
            productVariant: variant && typeof variant === 'object' && variant._id
                ? { _id: String(variant._id), size: String(variant.size), color: String(variant.color), sku: String(variant.sku) }
                : { _id: String(item.productVariant), size: '', color: '', sku: '' },
            price: Number(item.price),
            quantity: Number(item.quantity),
        };
    });
};
// Helper to build order response
const convertGuestInfo = (guest) => {
    if (!guest)
        return null;
    return { name: guest.name, phone: guest.phone, address: guest.address };
};
const getOrders = async () => {
    const orders = await Order_1.default.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const items = await OrderItem_1.default.find({ order: order._id })
            .populate('product', 'title')
            .populate('productVariant', 'size color sku');
        return {
            _id: order._id.toString(),
            user: order.user ? convertUserToInfo(order.user) : null,
            guest: convertGuestInfo(order.guest),
            status: order.status,
            totalAmount: order.totalAmount,
            shippingAddress: order.shippingAddress,
            items: convertOrderItems(items),
            createdAt: order.createdAt,
        };
    }));
    return ordersWithItems;
};
exports.getOrders = getOrders;
const getOrderById = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid order ID');
    }
    const order = await Order_1.default.findById(id).populate('user', 'name email');
    if (!order) {
        return null;
    }
    const items = await OrderItem_1.default.find({ order: order._id })
        .populate('product', 'title')
        .populate('productVariant', 'size color sku');
    return {
        _id: order._id.toString(),
        user: order.user ? convertUserToInfo(order.user) : null,
        guest: convertGuestInfo(order.guest),
        status: order.status,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        items: convertOrderItems(items),
        createdAt: order.createdAt,
    };
};
exports.getOrderById = getOrderById;
const createOrder = async (data) => {
    const { user, guest, shippingAddress, items } = data;
    // Validate: must have either a user ID or guest info
    if (!user && !guest) {
        throw new Error('Either user ID or guest info is required');
    }
    // Validate user ID if provided
    let validUserId;
    if (user) {
        if (!mongoose_1.default.Types.ObjectId.isValid(user)) {
            throw new Error('Invalid user ID');
        }
        const userExists = await User_1.default.findById(user);
        if (!userExists) {
            throw new Error('User not found');
        }
        validUserId = user;
    }
    // Validate guest info if provided (and no user ID)
    if (!validUserId && guest) {
        if (!guest.name || !guest.name.trim()) {
            throw new Error('Guest name is required');
        }
        if (!guest.phone || !guest.phone.trim()) {
            throw new Error('Guest phone number is required');
        }
        if (!guest.address || !guest.address.trim()) {
            throw new Error('Guest address is required');
        }
    }
    // Validate required fields
    if (!shippingAddress || !shippingAddress.trim()) {
        throw new Error('Shipping address is required');
    }
    if (!items || items.length === 0) {
        throw new Error('At least one order item is required');
    }
    // Validate and resolve items from product variants
    const resolvedItems = [];
    for (const item of items) {
        if (!item.productVariantId || !mongoose_1.default.Types.ObjectId.isValid(item.productVariantId)) {
            throw new Error('Each item must have a valid productVariantId');
        }
        if (item.quantity === undefined || item.quantity < 1) {
            throw new Error('Each item must have a quantity of at least 1');
        }
        // Look up the variant
        const variant = await ProductVariant_1.default.findById(item.productVariantId);
        if (!variant) {
            throw new Error(`Product variant not found: ${item.productVariantId}`);
        }
        // Check stock
        if (variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for variant ${item.productVariantId}. Available: ${variant.stock}, requested: ${item.quantity}`);
        }
        // Look up the product
        const product = await Product_1.default.findById(variant.product);
        if (!product) {
            throw new Error(`Product not found for variant ${item.productVariantId}`);
        }
        if (!product.isActive) {
            throw new Error(`Product "${product.title}" is not currently available`);
        }
        // Calculate item price: base price + variant extra price
        const itemPrice = product.price + variant.extraPrice;
        resolvedItems.push({
            productId: product._id.toString(),
            productVariantId: variant._id.toString(),
            price: itemPrice,
            quantity: item.quantity,
        });
        // Decrease stock
        variant.stock -= item.quantity;
        await variant.save();
    }
    // Calculate total amount
    const totalAmount = resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // Create order
    const orderData = {
        status: 'pending',
        totalAmount,
        shippingAddress: shippingAddress.trim(),
    };
    if (validUserId) {
        orderData.user = validUserId;
    }
    else {
        orderData.guest = {
            name: guest.name.trim(),
            phone: guest.phone.trim(),
            address: guest.address.trim(),
        };
    }
    const order = new Order_1.default(orderData);
    await order.save();
    // Create order items
    await Promise.all(resolvedItems.map(item => new OrderItem_1.default({
        order: order._id,
        product: item.productId,
        productVariant: item.productVariantId,
        price: item.price,
        quantity: item.quantity,
    }).save()));
    // Fetch populated order items
    const populatedOrder = await Order_1.default.findById(order._id).populate('user', 'name email');
    const populatedItems = await OrderItem_1.default.find({ order: order._id })
        .populate('product', 'title')
        .populate('productVariant', 'size color sku');
    return {
        _id: populatedOrder._id.toString(),
        user: populatedOrder.user ? convertUserToInfo(populatedOrder.user) : null,
        guest: convertGuestInfo(populatedOrder.guest),
        status: populatedOrder.status,
        totalAmount: populatedOrder.totalAmount,
        shippingAddress: populatedOrder.shippingAddress,
        items: convertOrderItems(populatedItems),
        createdAt: populatedOrder.createdAt,
    };
};
exports.createOrder = createOrder;
const updateOrder = async (id, data) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid order ID');
    }
    const order = await Order_1.default.findById(id);
    if (!order) {
        throw new Error('Order not found');
    }
    // Validate status if provided
    if (data.status !== undefined) {
        const validStatuses = ['pending', 'paid', 'shipped', 'cancelled'];
        if (!validStatuses.includes(data.status)) {
            throw new Error('Status must be one of: pending, paid, shipped, cancelled');
        }
        order.status = data.status;
    }
    // Update shipping address if provided
    if (data.shippingAddress !== undefined) {
        if (!data.shippingAddress.trim()) {
            throw new Error('Shipping address cannot be empty');
        }
        order.shippingAddress = data.shippingAddress.trim();
    }
    await order.save();
    const populatedOrder = await Order_1.default.findById(order._id).populate('user', 'name email');
    const items = await OrderItem_1.default.find({ order: order._id })
        .populate('product', 'title')
        .populate('productVariant', 'size color sku');
    return {
        _id: populatedOrder._id.toString(),
        user: populatedOrder.user ? convertUserToInfo(populatedOrder.user) : null,
        guest: convertGuestInfo(populatedOrder.guest),
        status: populatedOrder.status,
        totalAmount: populatedOrder.totalAmount,
        shippingAddress: populatedOrder.shippingAddress,
        items: convertOrderItems(items),
        createdAt: populatedOrder.createdAt,
    };
};
exports.updateOrder = updateOrder;
const deleteOrder = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid order ID');
    }
    const order = await Order_1.default.findById(id);
    if (!order) {
        throw new Error('Order not found');
    }
    // Delete associated order items
    await OrderItem_1.default.deleteMany({ order: id });
    // Delete the order
    await Order_1.default.findByIdAndDelete(id);
};
exports.deleteOrder = deleteOrder;
//# sourceMappingURL=orderService.js.map