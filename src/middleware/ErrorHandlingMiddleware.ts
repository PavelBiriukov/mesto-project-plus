import {
  Errback,
  Request,
  Response,
} from 'express';
import ApiError from '../error/ApiError';
export interface IError {
  statusCode?: number;
  message: string;
  code?: number;
  name?: string;
}
export default function errorHandler(err: IError, _req: Request, res: Response) {
  if (err.code === 11000) {
    ApiError.ConflictError('Пользователь уже существует');
  }
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'На сервере произошла ошибка' });
}
