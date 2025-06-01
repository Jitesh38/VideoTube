// TODO: extended Error class to create a standard error response
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack.trim().length === 0) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };

// Creating an instance for a 404 Not Found error
// import { ApiError } from './utils/ApiError.js';
// const error = new ApiError(404, "Resource not found", ["Invalid ID provided"]);
// console.error(error);
