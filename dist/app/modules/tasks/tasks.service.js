"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const tasks_constant_1 = require("./tasks.constant");
const createTask = (userId, TaskData) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield prisma_1.default.user.findFirst({
        where: {
            id: userId,
        },
    });
    if (!userInfo) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    const result = yield prisma_1.default.task.create({
        data: Object.assign(Object.assign({}, TaskData), { userId }),
    });
    return result;
});
const getAllTask = (userId, filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filterData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: tasks_constant_1.tasksSearchableFields.map((field) => ({
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
                    equals: filterData[key],
                },
            })),
        });
    }
    if (userId) {
        andConditions.push({
            userId: userId,
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.task.findMany({
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
    const total = yield prisma_1.default.task.count({
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
});
const getSingleTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const TaskInfo = yield prisma_1.default.task.findFirst({
        where: {
            id
        }
    });
    if (!TaskInfo) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Task not found");
    }
    return TaskInfo;
});
const updateTaskInfo = (id, req) => __awaiter(void 0, void 0, void 0, function* () {
    const TaskInfo = yield prisma_1.default.task.findFirst({
        where: {
            id
        },
    });
    if (!TaskInfo) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Task does not exist");
    }
    const { title, desc } = req.body;
    const updatedTaskResult = yield prisma_1.default.task.update({
        where: { id },
        data: { title, desc }
    });
    return updatedTaskResult;
});
const deleteTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield prisma_1.default.task.findFirst({
        where: { id },
    });
    if (!task) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Task does not exist");
    }
    yield prisma_1.default.task.delete({
        where: { id },
    });
});
exports.TaskService = {
    createTask,
    getAllTask,
    getSingleTask,
    updateTaskInfo,
    deleteTask
};
