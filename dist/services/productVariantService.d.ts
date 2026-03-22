export interface ProductVariantResponse {
    _id: string;
    product: {
        _id: string;
        title: string;
        price: number;
    } | string;
    size: string;
    color: string;
    sku: string;
    stock: number;
    extraPrice: number;
}
export interface CreateProductVariantData {
    product: string;
    size: string;
    color: string;
    sku: string;
    stock?: number;
    extraPrice?: number;
}
export interface UpdateProductVariantData {
    size?: string;
    color?: string;
    sku?: string;
    stock?: number;
    extraPrice?: number;
}
export declare const getProductVariants: (productId?: string) => Promise<ProductVariantResponse[]>;
export declare const getProductVariantById: (id: string) => Promise<ProductVariantResponse | null>;
export declare const createProductVariant: (data: CreateProductVariantData) => Promise<ProductVariantResponse>;
export declare const updateProductVariant: (id: string, data: UpdateProductVariantData) => Promise<ProductVariantResponse>;
export declare const deleteProductVariant: (id: string) => Promise<void>;
//# sourceMappingURL=productVariantService.d.ts.map