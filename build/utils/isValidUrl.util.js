"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_util_1 = __importDefault(require("./ApiError.util"));
const isValidUrl = (str) => {
    const regex = /^(ftp|http|https):\/\/(?:www\.)?([a-zA-Z0-9-]+\.)([a-zA-Z]{2,})(\/[^\s]*)?$/;
    const result = regex.test(str);
    if (!result) {
        throw new ApiError_util_1.default(400, "Invalid link, give a proper one.");
    }
    else {
        return result;
    }
};
exports.default = isValidUrl;
