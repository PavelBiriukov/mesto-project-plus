import { NextFunction, Router } from 'express';
import userRouter from './user';
import cardsRouter from './cards';
import ApiError from '../exceptions/api-error';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardsRouter);

router.use((_req: any, _res: any, next: NextFunction) => next(ApiError.BadRequest('Запрашиваемый ресурс не найден')));

export default router;