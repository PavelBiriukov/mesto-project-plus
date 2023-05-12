import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ApiError from '../error/ApiError';

interface IAuthRequest extends Request {
  user?: string | JwtPayload
}

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

export default (req: IAuthRequest, _res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return ApiError.authorization('Необходима авторизация');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, process.env.SECRET_KEY as string || 'G0OSxv4FFzqX1O1KbkFaWmVVTW4kbWyI');
  } catch (err) {
    return ApiError.authorization('Необходима авторизация');
  }

  req.user = payload as { _id: JwtPayload };

  next();
};
