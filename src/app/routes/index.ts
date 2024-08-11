import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ProductRoutes } from '../modules/products/products.route';
import { TaskRoutes } from '../modules/tasks/tasks.route';
import { UserRoutes } from '../modules/user/user.route';
;


const router = express.Router();

const moduleRoutes = [
  // ... routes
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/user",
    route: UserRoutes
  },
  {
    path: "/product",
    route: ProductRoutes
  },
  {
    path: "/task",
    route: TaskRoutes
  },

];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
