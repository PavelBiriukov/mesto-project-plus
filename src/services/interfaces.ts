import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Document } from 'mongoose';

export interface IRequestCustom extends Request {
  user?: {
    _id?: string | JwtPayload;
  };
}

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export interface IError {
  statusCode?: number;
  message: string;
  code?: number;
  name?: string;
}
