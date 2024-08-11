import { Prisma, Product } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { productsSearchableFields } from "./products.constant";
import { IProductsFilterRequest } from "./products.interface";



const createProducts = async (userId: string, productData: Product): Promise<Product> => {

    const userInfo = await prisma.user.findFirst({
        where: {
            id: userId,
        },
    });

    if (!userInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
    }


    const result = await prisma.product.create({
        data: {
            ...productData,
            userId
        },
    });

    return result;
};

const getAllProducts = async (
    userId: string,
    filters: IProductsFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Product[]>> => {

    const { page, limit } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: productsSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    if (userId) {
        andConditions.push({
            userId: userId,
        });
    }

    const whereConditions: Prisma.ProductWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.product.findMany({
        where: whereConditions,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                title: "asc",
            },
        skip: (page - 1) * limit,
        take: limit,
    });

    const total = await prisma.product.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const getSingleProducts = async (id: string): Promise<Product | null> => {
    const ProductsInfo = await prisma.product.findFirst({
        where: {
            id
        }
    })

    if (!ProductsInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found")
    }


    return ProductsInfo;
}


const updateProductInfo = async (id: string, req: Request): Promise<Product> => {
    const productInfo = await prisma.product.findFirst({
        where: {
            id
        },
    })

    if (!productInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "product does not exist")
    }
    const { title, price, status } = req.body
    const updatedProductResult = await prisma.product.update({
        where: { id },
        data: { title, price, status }
    });

    return updatedProductResult
}

const deleteProduct = async (id: string): Promise<void> => {

    const product = await prisma.product.findFirst({
        where: { id },
    });

    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product does not exist");
    }

    await prisma.product.delete({
        where: { id },
    });

};

export const ProductService = {
    createProducts,
    getAllProducts,
    getSingleProducts,
    updateProductInfo,
    deleteProduct
}