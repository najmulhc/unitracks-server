"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("./ApiError"));
const authTester = (givenRole, expectedRole) => {
    if (givenRole === expectedRole) {
        return true;
    }
    else {
        throw new ApiError_1.default(402, "You Do not have permission to perform this task.");
    }
};
exports.default = authTester;
