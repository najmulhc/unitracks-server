"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiResponse {
    statusCode = 200;
    data = {};
    success = true;
    message = "Successfully performed the action";
    constructor(statusCode, data, message) {
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
    }
}
exports.default = ApiResponse;
