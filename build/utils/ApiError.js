"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
class ApiError extends Error {
    statusCode = 0;
    data = {};
    message = "";
    success = true;
    errors = [];
    constructor(statusCode, message = "Something went wrong.", errors = [], stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.data = null; // find what it is
        this.message = message;
        this.success = false;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.default = ApiError;
