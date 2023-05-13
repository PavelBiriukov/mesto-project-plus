import { Request } from 'express';

export interface IAppRequest extends Request {
  user?: {
    _id: string,
  };
}
