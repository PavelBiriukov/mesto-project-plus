import { STATUS_FORBIDDEN } from '../services/constants';

export default class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_FORBIDDEN;
  }
}
