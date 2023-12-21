"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_util_1 = __importDefault(require("./ApiError.util"));
const authTester = (givenRole, expectedRole) => {
    if (givenRole === expectedRole) {
        return true;
    }
    else {
        throw new ApiError_util_1.default(403, "You Do not have permission to perform this task.");
    }
};
exports.default = authTester;
