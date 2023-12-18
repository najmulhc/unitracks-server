"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    }
    catch (error) {
        return res.status(error?.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.default = asyncHandler;
