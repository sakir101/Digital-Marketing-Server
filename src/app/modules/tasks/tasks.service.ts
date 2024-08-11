import { Prisma, Task } from "@prisma/client";
import { Request } from "express";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import prisma from "../../../shared/prisma";
import { tasksSearchableFields } from "./tasks.constant";
import { ITasksFilterRequest } from "./tasks.interface";



const createTask = async (userId: string, TaskData: Task): Promise<Task> => {

    const userInfo = await prisma.user.findFirst({
        where: {
            id: userId,
        },
    });

    if (!userInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
    }


    const result = await prisma.task.create({
        data: {
            ...TaskData,
            userId
        },
    });

    return result;
};

const getAllTask = async (
    userId: string,
    filters: ITasksFilterRequest,
    options: IPaginationOptions
): Promise<IGenericResponse<Task[]>> => {

    const { page, limit } = paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;

    const andConditions = [];

    if (searchTerm) {
        andConditions.push({
            OR: tasksSearchableFields.map((field) => ({
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

    const whereConditions: Prisma.TaskWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.task.findMany({
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

    const total = await prisma.task.count({
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

const getSingleTask = async (id: string): Promise<Task | null> => {
    const TaskInfo = await prisma.task.findFirst({
        where: {
            id
        }
    })

    if (!TaskInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task not found")
    }


    return TaskInfo;
}


const updateTaskInfo = async (id: string, req: Request): Promise<Task> => {
    const TaskInfo = await prisma.task.findFirst({
        where: {
            id
        },
    })

    if (!TaskInfo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task does not exist")
    }
    const { title, desc } = req.body
    const updatedTaskResult = await prisma.task.update({
        where: { id },
        data: { title, desc }
    });

    return updatedTaskResult
}

const deleteTask = async (id: string): Promise<void> => {

    const task = await prisma.task.findFirst({
        where: { id },
    });

    if (!task) {
        throw new ApiError(httpStatus.NOT_FOUND, "Task does not exist");
    }

    await prisma.task.delete({
        where: { id },
    });

};
export const TaskService = {
    createTask,
    getAllTask,
    getSingleTask,
    updateTaskInfo,
    deleteTask
}