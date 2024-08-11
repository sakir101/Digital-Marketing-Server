"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const products_route_1 = require("../modules/products/products.route");
const tasks_route_1 = require("../modules/tasks/tasks.route");
const user_route_1 = require("../modules/user/user.route");
;
const router = express_1.default.Router();
const moduleRoutes = [
    // ... routes
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/user",
        route: user_route_1.UserRoutes
    },
    {
        path: "/product",
        route: products_route_1.ProductRoutes
    },
    {
        path: "/task",
        route: tasks_route_1.TaskRoutes
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
