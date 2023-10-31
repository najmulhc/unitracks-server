"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
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
        default: "unassigned"
    },
});
var User = mongoose.models.users || mongoose.model("user", userSchema);
exports.default = User;
