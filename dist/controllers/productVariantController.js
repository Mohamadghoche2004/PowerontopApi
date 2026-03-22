"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductVariantHandler = exports.updateProductVariantHandler = exports.createProductVariantHandler = exports.getProductVariant = exports.getAllProductVariants = void 0;
const productVariantService_1 = require("../services/productVariantService");
const getAllProductVariants = async (req, res) => {
    try {
        const productId = req.query.productId ? String(req.query.productId) : undefined;
        const variants = await (0, productVariantService_1.getProductVariants)(productId);
        res.status(200).json(variants);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch product variants';
        res.status(500).json({ error: message });
    }
};
exports.getAllProductVariants = getAllProductVariants;
const getProductVariant = async (req, res) => {
    try {
        const id = String(req.params.id);
        const variant = await (0, productVariantService_1.getProductVariantById)(id);
        if (!variant) {
            res.status(404).json({ error: 'Product variant not found' });
            return;
        }
        res.status(200).json(variant);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch product variant';
        res.status(400).json({ error: message });
    }
};
exports.getProductVariant = getProductVariant;
const createProductVariantHandler = async (req, res) => {
    try {
        const variant = await (0, productVariantService_1.createProductVariant)(req.body);
        res.status(201).json(variant);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to create product variant';
        res.status(400).json({ error: message });
    }
};
exports.createProductVariantHandler = createProductVariantHandler;
const updateProductVariantHandler = async (req, res) => {
    try {
        const id = String(req.params.id);
        const variant = await (0, productVariantService_1.updateProductVariant)(id, req.body);
        res.status(200).json(variant);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update product variant';
        if (message === 'Product variant not found') {
            res.status(404).json({ error: message });
        }
        else {
            res.status(400).json({ error: message });
        }
    }
};
exports.updateProductVariantHandler = updateProductVariantHandler;
const deleteProductVariantHandler = async (req, res) => {
    try {
        const id = String(req.params.id);
        await (0, productVariantService_1.deleteProductVariant)(id);
        res.status(200).json({ message: 'Product variant deleted successfully' });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete product variant';
        if (message === 'Product variant not found') {
            res.status(404).json({ error: message });
        }
        else {
            res.status(400).json({ error: message });
        }
    }
};
exports.deleteProductVariantHandler = deleteProductVariantHandler;
//# sourceMappingURL=productVariantController.js.map