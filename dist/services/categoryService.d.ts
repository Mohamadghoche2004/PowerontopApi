export interface CategoryResponse {
    _id: string;
    name: string;
    slug: string;
}
export interface CreateCategoryData {
    name: string;
    slug?: string;
}
export interface UpdateCategoryData {
    name?: string;
    slug?: string;
}
export declare const getCategories: () => Promise<CategoryResponse[]>;
export declare const createCategory: (data: CreateCategoryData) => Promise<CategoryResponse>;
export declare const updateCategory: (id: string, data: UpdateCategoryData) => Promise<CategoryResponse>;
export declare const deleteCategory: (id: string) => Promise<void>;
//# sourceMappingURL=categoryService.d.ts.map