"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const products_controller_1 = require("./products.controller");
const router = express_1.default.Router();
router.post('/:id/create-product', products_controller_1.ProductController.createProducts);
router.get('/:id/get-all', products_controller_1.ProductController.getAllProducts);
router.get('/:id', products_controller_1.ProductController.getSingleProduct);
router.patch('/:id/update-product', products_controller_1.ProductController.updateProductsInfo);
router.delete('/:id/delete-product', products_controller_1.ProductController.deleteProduct);
exports.ProductRoutes = router;
