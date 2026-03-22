"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductHandler = exports.updateProductHandler = exports.createProductHandler = exports.getProduct = exports.getAllProducts = void 0;
const productService_1 = require("../services/productService");
const getAllProducts = async (req, res) => {
    try {
        const products = await (0, productService_1.getProducts)();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch products' });
    }
};
exports.getAllProducts = getAllProducts;
const getProduct = async (req, res) => {
    try {
        const id = String(req.params.id);
        const product = await (0, productService_1.getProductById)(id);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Failed to fetch product' });
    }
};
exports.getProduct = getProduct;
const createProductHandler = async (req, res) => {
    try {
        const product = await (0, productService_1.createProduct)(req.body);
        res.status(201).json(product);
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Failed to create product' });
    }
};
exports.createProductHandler = createProductHandler;
const updateProductHandler = async (req, res) => {
    try {
        const id = String(req.params.id);
        const product = await (0, productService_1.updateProduct)(id, req.body);
        res.status(200).json(product);
    }
    catch (error) {
        if (error.message === 'Product not found') {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: error.message || 'Failed to update product' });
        }
    }
};
exports.updateProductHandler = updateProductHandler;
const deleteProductHandler = async (req, res) => {
    try {
        const id = String(req.params.id);
        await (0, productService_1.deleteProduct)(id);
        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        if (error.message === 'Product not found') {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: error.message || 'Failed to delete product' });
        }
    }
};
exports.deleteProductHandler = deleteProductHandler;
//# sourceMappingURL=productController.js.map