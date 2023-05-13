class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  static badRequest(message: string) {
    return new ApiError(400, message);
  }
  static ConflictError (message: string) {
    return new ApiError(11000, message);
  }

  static authorization(message: string) {
    return new ApiError(401, message);
  }

  static notFound(message: string) {
    return new ApiError(404, message);
  }

  static conflict(message: string) {
    return new ApiError(409, message);
  }
}

export default ApiError;
