export interface CategoryInfo {
    _id: string;
    name: string;
    slug: string;
}
export interface ProductResponse {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: CategoryInfo | string;
    images: string[];
    isActive: boolean;
    createdAt: Date;
}
export interface CreateProductData {
    title: string;
    description: string;
    price: number;
    category: string;
    images?: string[];
    isActive?: boolean;
}
export interface UpdateProductData {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    images?: string[];
    isActive?: boolean;
}
export declare const getProducts: () => Promise<ProductResponse[]>;
export declare const getProductById: (id: string) => Promise<ProductResponse | null>;
export declare const createProduct: (data: CreateProductData) => Promise<ProductResponse>;
export declare const updateProduct: (id: string, data: UpdateProductData) => Promise<ProductResponse>;
export declare const deleteProduct: (id: string) => Promise<void>;
//# sourceMappingURL=productService.d.ts.map