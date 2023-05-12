import validator from 'validator';
import { NextFunction } from 'express';
import { IError } from './interfaces';
import {
  MSG_ERROR_INVALID_DATA, MSG_ERROR_USER_ALREADY_EXIST, VALIDATION_ERROR, CAST_ERROR,
} from './constants';
import ConflictError from '../errors/conflict-err';
import BadRequestError from '../errors/bad-request-err';

export const emailValidator = {
  validator: (value: string) => validator.isEmail(value),
  message: (props: any) => `${props.value} не является правильным форматом для почты`,
};

export const handleOperationalErrors = (err: IError, next: NextFunction) => {
  if (err.code === 11000) {
    next(new ConflictError(MSG_ERROR_USER_ALREADY_EXIST));
  } else if (err.name === VALIDATION_ERROR || err.name === CAST_ERROR) {
    next(new BadRequestError(MSG_ERROR_INVALID_DATA));
  } else {
    next(err);
  }
};
