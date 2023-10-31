"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var adminSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "admin",
    },
});
var Admin = mongoose_1.default.models.admin || mongoose_1.default.model("admin", adminSchema);
exports.default = Admin;
