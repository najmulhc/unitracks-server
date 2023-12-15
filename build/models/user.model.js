"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        unique: true,
    },
    hashedPassword: {
        type: String,
    },
    role: {
        type: String,
        enum: {
            values: ["unassigned", "admin", "teacher", "student"],
        },
        default: "unassigned",
    },
    refreshToken: {
        type: String,
        default: undefined,
    },
});
const User = mongoose_1.default.models.users || mongoose_1.default.model("user", userSchema);
exports.default = User;
