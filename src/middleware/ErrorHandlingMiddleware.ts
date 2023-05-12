import {
  Errback,
  Request,
  Response,
} from 'express';
import ApiError from '../error/ApiError';

export default function errorHandler(err: Errback, _req: Request, res: Response) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'На сервере произошла ошибка' });
}
