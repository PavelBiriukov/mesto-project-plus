import { NextFunction, Router } from 'express';
import userRouter from './userRouter';
import cardsRouter from './cardsRouter';
import ApiError from '../error/ApiError';

const router = Router();

router.use('/users', userRouter);
router.use('/cards', cardsRouter);

router.use((_req, _res, next: NextFunction) => next(ApiError.notFound('Запрашиваемый ресурс не найден')));

export default router;
