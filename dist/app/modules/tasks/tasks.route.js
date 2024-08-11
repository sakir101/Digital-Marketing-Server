"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tasks_controller_1 = require("./tasks.controller");
const router = express_1.default.Router();
router.post('/:id/create-task', tasks_controller_1.TaskController.createTasks);
router.get('/:id/get-all', tasks_controller_1.TaskController.getAllTasks);
router.get('/:id', tasks_controller_1.TaskController.getSingleTask);
router.patch('/:id/update-task', tasks_controller_1.TaskController.updateTasksInfo);
router.delete('/:id/delete-task', tasks_controller_1.TaskController.deleteTask);
exports.TaskRoutes = router;
