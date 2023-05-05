export default class ApiError extends Error {
    status: any;
    errors: never[];

    constructor(status: number, message: string | undefined, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static BadRequest(message: any, errors = []) {
        return new ApiError(400, message, errors);
    }
}
