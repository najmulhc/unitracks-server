"use strict";
//  get all dashboar data for admin
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardInfo = void 0;
const ApiError_util_1 = __importDefault(require("../utils/ApiError.util"));
const student_model_1 = __importDefault(require("../models/student.model"));
const ApiResponse_util_1 = __importDefault(require("../utils/ApiResponse.util"));
const getDashboardInfo = async (req, res) => {
    const { role } = req.user;
    if (role === "admin") {
        /**
         *  as admin we need infos like,
         * number of students, teachers, courses
         *
         */
    }
    else if (role === "student") {
    }
    else if (role === "teacher") {
        const student = await student_model_1.default.aggregate([
            {
                $match: {
                    userId: req.user._id,
                },
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "students",
                    as: "courses",
                },
            },
            {
                $addFields: {
                    courseCount: {
                        $size: "courses",
                    },
                },
            },
        ]);
        res.status(200).json(new ApiResponse_util_1.default(200, {
            student,
        }, "got the dashboard data for students."));
    }
    if (!role || role === "unassigned") {
        throw new ApiError_util_1.default(403, "You do not have permission to have dashboard data.");
    }
};
exports.getDashboardInfo = getDashboardInfo;
