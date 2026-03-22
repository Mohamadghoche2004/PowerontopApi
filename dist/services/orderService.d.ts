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
export declare const getOrders: () => Promise<OrderResponse[]>;
export declare const getOrderById: (id: string) => Promise<OrderResponse | null>;
export declare const createOrder: (data: CreateOrderData) => Promise<OrderResponse>;
export declare const updateOrder: (id: string, data: UpdateOrderData) => Promise<OrderResponse>;
export declare const deleteOrder: (id: string) => Promise<void>;
//# sourceMappingURL=orderService.d.ts.map