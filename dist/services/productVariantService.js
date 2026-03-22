"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductVariant = exports.updateProductVariant = exports.createProductVariant = exports.getProductVariantById = exports.getProductVariants = void 0;
const ProductVariant_1 = __importDefault(require("../models/ProductVariant"));
const Product_1 = __importDefault(require("../models/Product"));
const mongoose_1 = __importDefault(require("mongoose"));
const convertVariant = (variant, populatedProduct) => {
    const product = populatedProduct || variant.product;
    let productInfo;
    if (product && typeof product === 'object' && '_id' in product) {
        const p = product;
        productInfo = { _id: p._id.toString(), title: p.title, price: p.price };
    }
    else {
        productInfo = variant.product.toString();
    }
    return {
        _id: variant._id.toString(),
        product: productInfo,
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        stock: variant.stock,
        extraPrice: variant.extraPrice,
    };
};
const getProductVariants = async (productId) => {
    const filter = productId ? { product: productId } : {};
    const variants = await ProductVariant_1.default.find(filter).populate('product', 'title price');
    return variants.map(variant => convertVariant(variant));
};
exports.getProductVariants = getProductVariants;
const getProductVariantById = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product variant ID');
    }
    const variant = await ProductVariant_1.default.findById(id).populate('product', 'title price');
    if (!variant)
        return null;
    return convertVariant(variant);
};
exports.getProductVariantById = getProductVariantById;
const createProductVariant = async (data) => {
    const { product, size, color, sku, stock = 0, extraPrice = 0 } = data;
    // Validate product
    if (!product || !mongoose_1.default.Types.ObjectId.isValid(product)) {
        throw new Error('Invalid product ID');
    }
    const productExists = await Product_1.default.findById(product);
    if (!productExists) {
        throw new Error('Product not found');
    }
    // Validate required fields
    if (!size)
        throw new Error('Size is required');
    if (!color)
        throw new Error('Color is required');
    if (!sku || !sku.trim())
        throw new Error('SKU is required');
    // Validate enums
    if (!['S', 'M', 'L'].includes(size)) {
        throw new Error('Size must be one of: S, M, L');
    }
    if (!['Red', 'Black'].includes(color)) {
        throw new Error('Color must be one of: Red, Black');
    }
    // Check SKU uniqueness
    const existingSku = await ProductVariant_1.default.findOne({ sku: sku.trim() });
    if (existingSku) {
        throw new Error('A variant with this SKU already exists');
    }
    // Check duplicate variant (same product + size + color)
    const existingVariant = await ProductVariant_1.default.findOne({ product, size, color });
    if (existingVariant) {
        throw new Error('A variant with this size and color already exists for this product');
    }
    const variant = new ProductVariant_1.default({
        product,
        size,
        color,
        sku: sku.trim(),
        stock,
        extraPrice,
    });
    await variant.save();
    const populated = await ProductVariant_1.default.findById(variant._id).populate('product', 'title price');
    return convertVariant(populated);
};
exports.createProductVariant = createProductVariant;
const updateProductVariant = async (id, data) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product variant ID');
    }
    const variant = await ProductVariant_1.default.findById(id);
    if (!variant) {
        throw new Error('Product variant not found');
    }
    if (data.size !== undefined) {
        if (!['S', 'M', 'L'].includes(data.size)) {
            throw new Error('Size must be one of: S, M, L');
        }
        variant.size = data.size;
    }
    if (data.color !== undefined) {
        if (!['Red', 'Black'].includes(data.color)) {
            throw new Error('Color must be one of: Red, Black');
        }
        variant.color = data.color;
    }
    if (data.sku !== undefined) {
        if (!data.sku.trim())
            throw new Error('SKU cannot be empty');
        const existingSku = await ProductVariant_1.default.findOne({ sku: data.sku.trim(), _id: { $ne: id } });
        if (existingSku)
            throw new Error('A variant with this SKU already exists');
        variant.sku = data.sku.trim();
    }
    if (data.stock !== undefined) {
        if (data.stock < 0)
            throw new Error('Stock cannot be negative');
        variant.stock = data.stock;
    }
    if (data.extraPrice !== undefined) {
        if (data.extraPrice < 0)
            throw new Error('Extra price cannot be negative');
        variant.extraPrice = data.extraPrice;
    }
    await variant.save();
    const populated = await ProductVariant_1.default.findById(variant._id).populate('product', 'title price');
    return convertVariant(populated);
};
exports.updateProductVariant = updateProductVariant;
const deleteProductVariant = async (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid product variant ID');
    }
    const variant = await ProductVariant_1.default.findById(id);
    if (!variant) {
        throw new Error('Product variant not found');
    }
    await ProductVariant_1.default.findByIdAndDelete(id);
};
exports.deleteProductVariant = deleteProductVariant;
//# sourceMappingURL=productVariantService.js.map