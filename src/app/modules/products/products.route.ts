import express from 'express';
import { ProductController } from './products.controller';


const router = express.Router();

router.post('/:id/create-product',
    ProductController.createProducts)

router.get('/:id/get-all',
    ProductController.getAllProducts)

router.get('/:id',
    ProductController.getSingleProduct)

router.patch('/:id/update-product',
    ProductController.updateProductsInfo)

router.delete('/:id/delete-product',
    ProductController.deleteProduct)

export const ProductRoutes = router;