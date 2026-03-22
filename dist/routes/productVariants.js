"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productVariantController_1 = require("../controllers/productVariantController");
const router = express_1.default.Router();
router.get('/', productVariantController_1.getAllProductVariants);
router.get('/:id', productVariantController_1.getProductVariant);
router.post('/', productVariantController_1.createProductVariantHandler);
router.put('/:id', productVariantController_1.updateProductVariantHandler);
router.delete('/:id', productVariantController_1.deleteProductVariantHandler);
exports.default = router;
//# sourceMappingURL=productVariants.js.map