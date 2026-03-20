import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import User from '../models/User';
import Product from '../models/Product';
import ProductVariant from '../models/ProductVariant';
import mongoose from 'mongoose';
import { IOrder } from '../types/Order';
import { IUser } from '../types/User';
import { IProduct } from '../types/Product';
import { IProductVariant } from '../types/ProductVariant';

export interface OrderItemInput {
  productVariantId: string;
  quantity: number;
}

export interface OrderItemResponse {
  _id: string;
  product: {
    _id: string;
    title: string;
  };
  productVariant: {
    _id: string;
    size: string;
    color: string;
    sku: string;
  };
  price: number;
  quantity: number;
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

export interface GuestInfoResponse {
  name: string;
  phone: string;
  address: string;
}

export interface OrderResponse {
  _id: string;
  user: UserInfo | string | null;
  guest: GuestInfoResponse | null;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  totalAmount: number;
  shippingAddress: string;
  items: OrderItemResponse[];
  createdAt: Date;
}

export interface CreateOrderData {
  user?: string;
  guest?: {
    name: string;
    phone: string;
    address: string;
  };
  shippingAddress: string;
  items: OrderItemInput[];
}

export interface UpdateOrderData {
  status?: string;
  shippingAddress?: string;
}

// Helper to convert populated user to UserInfo
const convertUserToInfo = (user: IUser | mongoose.Types.ObjectId | string | null | undefined): UserInfo | string => {
  if (!user) return '';
  if (typeof user === 'string') return user;
  if (user instanceof mongoose.Types.ObjectId) return user.toString();
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
const convertOrderItems = (items: Array<Record<string, unknown>>): OrderItemResponse[] => {
  return items.map(item => {
    const product = item.product as Record<string, unknown> | undefined;
    const variant = item.productVariant as Record<string, unknown> | undefined;

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
const convertGuestInfo = (guest: IOrder['guest']): GuestInfoResponse | null => {
  if (!guest) return null;
  return { name: guest.name, phone: guest.phone, address: guest.address };
};

export const getOrders = async (): Promise<OrderResponse[]> => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await OrderItem.find({ order: order._id })
        .populate('product', 'title')
        .populate('productVariant', 'size color sku');

      return {
        _id: order._id.toString(),
        user: order.user ? convertUserToInfo(order.user as IUser | mongoose.Types.ObjectId) : null,
        guest: convertGuestInfo(order.guest),
        status: order.status,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        items: convertOrderItems(items as unknown as Array<Record<string, unknown>>),
        createdAt: order.createdAt,
      };
    })
  );

  return ordersWithItems;
};

export const getOrderById = async (id: string): Promise<OrderResponse | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid order ID');
  }

  const order = await Order.findById(id).populate('user', 'name email');

  if (!order) {
    return null;
  }

  const items = await OrderItem.find({ order: order._id })
    .populate('product', 'title')
    .populate('productVariant', 'size color sku');

  return {
    _id: order._id.toString(),
    user: order.user ? convertUserToInfo(order.user as IUser | mongoose.Types.ObjectId) : null,
    guest: convertGuestInfo(order.guest),
    status: order.status,
    totalAmount: order.totalAmount,
    shippingAddress: order.shippingAddress,
    items: convertOrderItems(items as unknown as Array<Record<string, unknown>>),
    createdAt: order.createdAt,
  };
};

export const createOrder = async (data: CreateOrderData): Promise<OrderResponse> => {
  const { user, guest, shippingAddress, items } = data;

  // Validate: must have either a user ID or guest info
  if (!user && !guest) {
    throw new Error('Either user ID or guest info is required');
  }

  // Validate user ID if provided
  let validUserId: string | undefined;
  if (user) {
    if (!mongoose.Types.ObjectId.isValid(user)) {
      throw new Error('Invalid user ID');
    }
    const userExists = await User.findById(user);
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
  const resolvedItems: {
    productId: string;
    productVariantId: string;
    price: number;
    quantity: number;
  }[] = [];

  for (const item of items) {
    if (!item.productVariantId || !mongoose.Types.ObjectId.isValid(item.productVariantId)) {
      throw new Error('Each item must have a valid productVariantId');
    }
    if (item.quantity === undefined || item.quantity < 1) {
      throw new Error('Each item must have a quantity of at least 1');
    }

    // Look up the variant
    const variant = await ProductVariant.findById(item.productVariantId) as IProductVariant | null;
    if (!variant) {
      throw new Error(`Product variant not found: ${item.productVariantId}`);
    }

    // Check stock
    if (variant.stock < item.quantity) {
      throw new Error(`Insufficient stock for variant ${item.productVariantId}. Available: ${variant.stock}, requested: ${item.quantity}`);
    }

    // Look up the product
    const product = await Product.findById(variant.product) as IProduct | null;
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
  const orderData: Record<string, unknown> = {
    status: 'pending',
    totalAmount,
    shippingAddress: shippingAddress.trim(),
  };

  if (validUserId) {
    orderData.user = validUserId;
  } else {
    orderData.guest = {
      name: guest!.name.trim(),
      phone: guest!.phone.trim(),
      address: guest!.address.trim(),
    };
  }

  const order = new Order(orderData);

  await order.save();

  // Create order items
  await Promise.all(
    resolvedItems.map(item =>
      new OrderItem({
        order: order._id,
        product: item.productId,
        productVariant: item.productVariantId,
        price: item.price,
        quantity: item.quantity,
      }).save()
    )
  );

  // Fetch populated order items
  const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
  const populatedItems = await OrderItem.find({ order: order._id })
    .populate('product', 'title')
    .populate('productVariant', 'size color sku');

  return {
    _id: populatedOrder!._id.toString(),
    user: populatedOrder!.user ? convertUserToInfo(populatedOrder!.user as IUser | mongoose.Types.ObjectId) : null,
    guest: convertGuestInfo(populatedOrder!.guest),
    status: populatedOrder!.status,
    totalAmount: populatedOrder!.totalAmount,
    shippingAddress: populatedOrder!.shippingAddress,
    items: convertOrderItems(populatedItems as unknown as Array<Record<string, unknown>>),
    createdAt: populatedOrder!.createdAt,
  };
};

export const updateOrder = async (id: string, data: UpdateOrderData): Promise<OrderResponse> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid order ID');
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new Error('Order not found');
  }

  // Validate status if provided
  if (data.status !== undefined) {
    const validStatuses = ['pending', 'paid', 'shipped', 'cancelled'];
    if (!validStatuses.includes(data.status)) {
      throw new Error('Status must be one of: pending, paid, shipped, cancelled');
    }
    order.status = data.status as IOrder['status'];
  }

  // Update shipping address if provided
  if (data.shippingAddress !== undefined) {
    if (!data.shippingAddress.trim()) {
      throw new Error('Shipping address cannot be empty');
    }
    order.shippingAddress = data.shippingAddress.trim();
  }

  await order.save();

  const populatedOrder = await Order.findById(order._id).populate('user', 'name email');
  const items = await OrderItem.find({ order: order._id })
    .populate('product', 'title')
    .populate('productVariant', 'size color sku');

  return {
    _id: populatedOrder!._id.toString(),
    user: populatedOrder!.user ? convertUserToInfo(populatedOrder!.user as IUser | mongoose.Types.ObjectId) : null,
    guest: convertGuestInfo(populatedOrder!.guest),
    status: populatedOrder!.status,
    totalAmount: populatedOrder!.totalAmount,
    shippingAddress: populatedOrder!.shippingAddress,
    items: convertOrderItems(items as unknown as Array<Record<string, unknown>>),
    createdAt: populatedOrder!.createdAt,
  };
};

export const deleteOrder = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid order ID');
  }

  const order = await Order.findById(id);
  if (!order) {
    throw new Error('Order not found');
  }

  // Delete associated order items
  await OrderItem.deleteMany({ order: id });

  // Delete the order
  await Order.findByIdAndDelete(id);
};
