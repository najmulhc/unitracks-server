"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next);
    }
    catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};
exports.default = asyncHandler;
