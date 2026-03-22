"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryHandler = exports.updateCategoryHandler = exports.createCategoryHandler = exports.getAllCategories = void 0;
const categoryService_1 = require("../services/categoryService");
const getAllCategories = async (req, res) => {
    try {
        const categories = await (0, categoryService_1.getCategories)();
        res.status(200).json(categories);
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Failed to fetch categories' });
    }
};
exports.getAllCategories = getAllCategories;
const createCategoryHandler = async (req, res) => {
    try {
        const category = await (0, categoryService_1.createCategory)(req.body);
        res.status(201).json(category);
    }
    catch (error) {
        res.status(400).json({ error: error.message || 'Failed to create category' });
    }
};
exports.createCategoryHandler = createCategoryHandler;
const updateCategoryHandler = async (req, res) => {
    try {
        const id = String(req.params.id);
        const category = await (0, categoryService_1.updateCategory)(id, req.body);
        res.status(200).json(category);
    }
    catch (error) {
        if (error.message === 'Category not found') {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: error.message || 'Failed to update category' });
        }
    }
};
exports.updateCategoryHandler = updateCategoryHandler;
const deleteCategoryHandler = async (req, res) => {
    try {
        const id = String(req.params.id);
        await (0, categoryService_1.deleteCategory)(id);
        res.status(200).json({ message: 'Category deleted successfully' });
    }
    catch (error) {
        if (error.message === 'Category not found') {
            res.status(404).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: error.message || 'Failed to delete category' });
        }
    }
};
exports.deleteCategoryHandler = deleteCategoryHandler;
//# sourceMappingURL=categoryController.js.map