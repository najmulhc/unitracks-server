"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
var ApiError = /** @class */ (function (_super) {
    __extends(ApiError, _super);
    function ApiError(statusCode, message, errors, stack) {
        if (message === void 0) { message = "Something went wrong."; }
        if (errors === void 0) { errors = []; }
        if (stack === void 0) { stack = ""; }
        var _this = _super.call(this, message) || this;
        _this.statusCode = 0;
        _this.data = {};
        _this.message = "";
        _this.success = true;
        _this.errors = [];
        _this.statusCode = statusCode;
        _this.data = null; // find what it is
        _this.message = message;
        _this.success = false;
        _this.errors = errors;
        if (stack) {
            _this.stack = stack;
        }
        else {
            Error.captureStackTrace(_this, _this.constructor);
        }
        return _this;
    }
    return ApiError;
}(Error));
exports.default = ApiError;
