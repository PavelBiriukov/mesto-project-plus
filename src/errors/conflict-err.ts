import { STATUS_ALREADY_EXIST_ERROR } from '../services/constants';

export default class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_ALREADY_EXIST_ERROR;
  }
}
