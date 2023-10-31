"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_model_1 = __importDefault(require("../models/user.model"));
var jwt = require("jsonwebtoken");
var varifyJWT = function (req, res, next) {
    var authorization = req.headers.authorization;
    var token = authorization.split(" ")[1];
    var decoded = jwt.varify(token, process.env.JWT_SIGN);
    if (!decoded) {
        throw new Error("Invalid token given");
    }
    var email = decoded.email;
    user_model_1.default.findOne({
        email: email,
    }).then(function (user) {
        if (!user) {
            throw new Error("user does not exists");
        }
        req.body.email = user === null || user === void 0 ? void 0 : user.email;
        req.body.role = user === null || user === void 0 ? void 0 : user.role;
    });
    next();
};
exports.default = varifyJWT;
