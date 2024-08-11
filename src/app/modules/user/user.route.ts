import express from 'express';
import { UserController } from './user.controller';


const router = express.Router();

router.post('/create-user',
    UserController.createUser)

router.get('/:id',
    UserController.getSingleUser)

export const UserRoutes = router;