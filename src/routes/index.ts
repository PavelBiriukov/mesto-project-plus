import {
  Router, Request, Response, NextFunction,
} from 'express';
import NotFoundError from '../errors/not-found-err';
import usersRouter from './uesers';
import cardsRouter from './cards';

const router = Router();

router.use('/cards', cardsRouter);
router.use('/users', usersRouter);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Маршрут не найден'));
});

export default router;
