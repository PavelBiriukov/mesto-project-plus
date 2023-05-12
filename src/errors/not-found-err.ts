import { STATUS_NOT_FOUND } from '../services/constants';

export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_NOT_FOUND;
  }
}
