import {
  Errback,
  Request,
  Response,
  NextFunction,
} from 'express';
import ConflictError from 'error/conflict-err';
import BadRequestError from 'error/bad-request-err';
import validator from 'validator';
import ApiError from '../error/ApiError';

export interface IError {
  statusCode?: number;
  message: string;
  code?: number;
  name?: string;
}
export const emailValidator = {
  validator: (value: string) => validator.isEmail(value),
  message: (props: any) => `${props.value} не является правильным форматом для почты`,
};

export const handleOperationalErrors = (err: IError, next: NextFunction) => {
  if (err.code === 11000) {
    next(new ConflictError('Пользователь уже существует'));
  } else if (err.name === 'ValidationError' || err.name === 'CastError') {
    next(new BadRequestError('Переданы некорректные данные'));
  } else {
    next(err);
  }
};
