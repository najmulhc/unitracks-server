"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var studentSchema = new mongoose_1.Schema({});
var Student = (0, mongoose_1.model)("student", studentSchema);
exports.default = Student;
