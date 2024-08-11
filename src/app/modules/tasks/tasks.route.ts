import express from 'express';
import { TaskController } from './tasks.controller';


const router = express.Router();

router.post('/:id/create-task',
    TaskController.createTasks)

router.get('/:id/get-all',
    TaskController.getAllTasks)

router.get('/:id',
    TaskController.getSingleTask)

router.patch('/:id/update-task',
    TaskController.updateTasksInfo)

router.delete('/:id/delete-task',
    TaskController.deleteTask)

export const TaskRoutes = router;