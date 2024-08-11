import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { productsFilterableFields } from "./products.constant";
import { ProductService } from "./products.servive";

const createProducts = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProductService.createProducts(id, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Products created successfully',
        data: result
    });


})

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, productsFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await ProductService.getAllProducts(id, filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Products data are fetched",
        meta: result.meta,
        data: result.data
    })
})

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {


    const result = await ProductService.getSingleProducts(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Products data fetched",
        data: result
    })
})

const updateProductsInfo = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProductService.updateProductInfo(id, req)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Products info updated successfully',
        data: result
    });
})

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ProductService.deleteProduct(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Products info deleted successfully',
        data: result
    });
})

export const ProductController = {
    createProducts,
    getAllProducts,
    getSingleProduct,
    updateProductsInfo,
    deleteProduct
}