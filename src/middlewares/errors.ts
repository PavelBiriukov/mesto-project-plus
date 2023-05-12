import { Request, Response, NextFunction } from 'express';
import {
  STATUS_SERVER_ERROR,
} from '../services/constants';
import { IError } from '../services/interfaces';

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = STATUS_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === STATUS_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
};

export default errorMiddleware;
