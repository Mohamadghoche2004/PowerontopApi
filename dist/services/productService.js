"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const ProductVariant_1 = __importDefault(require("../models/ProductVariant"));
const mongoose_1 = __importDefault(require("mongoose"));
// Helper function to convert populated category to CategoryInfo
const convertCategoryToInfo = (category) => {
    if (!category) {
        return '';
    }
    if (typeof category === 'string') {
        return category;
    }
    if (category instanceof mongoose_1.default.Types.ObjectId) {
        return category.toString();
    }
    // Type guard to check if it's ICategory
    if ('_id' in category && 'name' in category && 'slug' in category) {
        return {
            _id: category._id.toString(),
            name: category.name,
            slug: category.slug,
        };
    }
    return '';
};
const getProducts = async () => {
    const products = await Product_1.default.find()
        .populate('category', 'name slug')
        .sort({ createdAt: -1 });
    return products.map(product => ({
        _id: product._id.toString(),
        title: product.title,
        description: product.description,
        price: product.price,
        category: convertCategoryToInfo(product.category),
        images: product.images,
        isActive: product.isActive,
        createdAt: product.createdAt,
    }));
};
exports.getProducts = getProducts;
const getProductById = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID');
    }
    const product = await Product_1.default.findById(id).populate('category', 'name slug');
    if (!product) {
        return null;
    }
    return {
        _id: product._id.toString(),
        title: product.title,
        description: product.description,
        price: product.price,
        category: convertCategoryToInfo(product.category),
        images: product.images,
        isActive: product.isActive,
        createdAt: product.createdAt,
    };
};
exports.getProductById = getProductById;
const createProduct = async (data) => {
    const { title, description, price, category, images = [], isActive = true } = data;
    // Validate category exists
    if (!mongoose_1.default.Types.ObjectId.isValid(category)) {
        throw new Error('Invalid category ID');
    }
    const categoryExists = await Category_1.default.findById(category);
    if (!categoryExists) {
        throw new Error('Category not found');
    }
    // Validate required fields
    if (!title || !description || price === undefined) {
        throw new Error('Title, description, and price are required');
    }
    if (price < 0) {
        throw new Error('Price must be a positive number');
    }
    const product = new Product_1.default({
        title,
        description,
        price,
        category,
        images,
        isActive,
    });
    await product.save();
    const populatedProduct = await Product_1.default.findById(product._id).populate('category', 'name slug');
    return {
        _id: populatedProduct._id.toString(),
        title: populatedProduct.title,
        description: populatedProduct.description,
        price: populatedProduct.price,
        category: convertCategoryToInfo(populatedProduct.category),
        images: populatedProduct.images,
        isActive: populatedProduct.isActive,
        createdAt: populatedProduct.createdAt,
    };
};
exports.createProduct = createProduct;
const updateProduct = async (id, data) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID');
    }
    const product = await Product_1.default.findById(id);
    if (!product) {
        throw new Error('Product not found');
    }
    // Validate category if provided
    if (data.category) {
        if (!mongoose_1.default.Types.ObjectId.isValid(data.category)) {
            throw new Error('Invalid category ID');
        }
        const categoryExists = await Category_1.default.findById(data.category);
        if (!categoryExists) {
            throw new Error('Category not found');
        }
    }
    // Validate price if provided
    if (data.price !== undefined && data.price < 0) {
        throw new Error('Price must be a positive number');
    }
    // Update fields
    if (data.title !== undefined)
        product.title = data.title;
    if (data.description !== undefined)
        product.description = data.description;
    if (data.price !== undefined)
        product.price = data.price;
    if (data.category !== undefined) {
        product.category = new mongoose_1.default.Types.ObjectId(data.category);
    }
    if (data.images !== undefined)
        product.images = data.images;
    if (data.isActive !== undefined)
        product.isActive = data.isActive;
    await product.save();
    const populatedProduct = await Product_1.default.findById(product._id).populate('category', 'name slug');
    return {
        _id: populatedProduct._id.toString(),
        title: populatedProduct.title,
        description: populatedProduct.description,
        price: populatedProduct.price,
        category: convertCategoryToInfo(populatedProduct.category),
        images: populatedProduct.images,
        isActive: populatedProduct.isActive,
        createdAt: populatedProduct.createdAt,
    };
};
exports.updateProduct = updateProduct;
const deleteProduct = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product ID');
    }
    const product = await Product_1.default.findById(id);
    if (!product) {
        throw new Error('Product not found');
    }
    // Delete associated product variants
    await ProductVariant_1.default.deleteMany({ product: id });
    // Delete the product
    await Product_1.default.findByIdAndDelete(id);
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productService.js.map