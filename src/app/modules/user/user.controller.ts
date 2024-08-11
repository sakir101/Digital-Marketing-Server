import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.createUser(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User created successfully',
        data: result
    });


})

const getSingleUser = catchAsync(async (req: Request, res: Response) => {


    const result = await UserService.getSingleUser(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User data fetched",
        data: result
    })
})

export const UserController = {
    createUser,
    getSingleUser,
}