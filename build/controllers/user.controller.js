"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.beAnAdmin = exports.login = exports.basicRegister = void 0;
var user_model_1 = __importDefault(require("../models/user.model"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var dbconnect_1 = __importDefault(require("../dbconnect"));
var admin_model_1 = __importDefault(require("../models/admin.model"));
var jwt = require("jsonwebtoken");
// in the first time the user will have no role assigned, so we will create a simple unassigned user role untill
var basicRegister = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, saltRounds, hashedPassword, createdUser, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, dbconnect_1.default)()];
            case 1:
                _b.sent();
                _a = req.body, email = _a.email, password = _a.password;
                saltRounds = 12;
                return [4 /*yield*/, bcrypt_1.default.hash(password, saltRounds)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, user_model_1.default.create({
                        email: email,
                        hashedPassword: hashedPassword,
                        role: "unassigned",
                    })];
            case 3:
                createdUser = _b.sent();
                token = jwt.sign({ email: email }, process.env.JWT_SIGN);
                res.json({
                    success: true,
                    user: createdUser,
                    token: token,
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                res.json({
                    success: false,
                    body: { email: req.body.email, password: req.body.password },
                    message: error_1.message,
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.basicRegister = basicRegister;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, compared, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, dbconnect_1.default)()];
            case 1:
                _b.sent();
                _a = req.body, email = _a.email, password = _a.password;
                user = null;
                return [4 /*yield*/, user_model_1.default.findOne({
                        email: email,
                    })];
            case 2:
                //find user
                user = _b.sent();
                if (!user) {
                    throw new Error("User not found");
                }
                compared = bcrypt_1.default.compare(password, user.hashedPassword);
                if (!compared) {
                    throw new Error("Incorrect password!");
                }
                token = jwt.sign({
                    email: email,
                }, process.env.JWT_SIGN);
                return [2 /*return*/, res.json({
                        success: true,
                        token: token,
                        role: user.role,
                    })];
            case 3:
                error_2 = _b.sent();
                return [2 /*return*/, res.json({
                        success: false,
                        message: error_2.message,
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
// when an unassigned user wanted to be an admin.
var beAnAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, role, key, admin, updatedUser, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, dbconnect_1.default)()];
            case 1:
                _b.sent();
                _a = req.body, email = _a.email, role = _a.role, key = _a.key;
                if (role !== "unassigned") {
                    throw new Error("You do not have permission to perform this task.");
                }
                if (key !== "uU06Qh,33g&,M4~X" || !key) {
                    throw new Error("Invalid admin key");
                }
                return [4 /*yield*/, admin_model_1.default.create({
                        email: email,
                    })];
            case 2:
                admin = _b.sent();
                return [4 /*yield*/, user_model_1.default.findOneAndUpdate({ email: email }, {
                        role: "admin",
                    }, {
                        new: true,
                    })];
            case 3:
                updatedUser = _b.sent();
                res.json({
                    success: true,
                    user: updatedUser,
                });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                return [2 /*return*/, res.json({
                        success: false,
                        message: error_3.message,
                    })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.beAnAdmin = beAnAdmin;
// sign up as admin
// set role for users
// delete unwanted users
