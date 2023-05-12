import { STATUS_UNAUTHORIZED_ERROR } from '../services/constants';

export default class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_UNAUTHORIZED_ERROR;
  }
}
