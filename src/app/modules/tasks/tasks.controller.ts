import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { tasksFilterableFields } from "./tasks.constant";
import { TaskService } from "./tasks.service";


const createTasks = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TaskService.createTask(id, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Tasks created successfully',
        data: result
    });


})

const getAllTasks = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const filters = pick(req.query, tasksFilterableFields)
    const options = pick(req.query, ['size', 'page', 'sortBy', 'sortOrder'])

    const result = await TaskService.getAllTask(id, filters, options)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Tasks data are fetched",
        meta: result.meta,
        data: result.data
    })
})

const getSingleTask = catchAsync(async (req: Request, res: Response) => {


    const result = await TaskService.getSingleTask(req.params.id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Task data fetched",
        data: result
    })
})

const updateTasksInfo = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TaskService.updateTaskInfo(id, req)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Tasks info updated successfully',
        data: result
    });
})

const deleteTask = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TaskService.deleteTask(id)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Tasks info deleted successfully',
        data: result
    });
})

export const TaskController = {
    createTasks,
    getAllTasks,
    getSingleTask,
    updateTasksInfo,
    deleteTask
}