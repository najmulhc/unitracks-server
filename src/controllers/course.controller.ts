import { Request, Response } from "express";
import { CourseType, UserRequest } from "../types";
import authTester from "../utils/authTester";
import ApiError from "../utils/ApiError";
import Teacher from "../models/teacher.model";
import Course from "../models/course.model";
export const createCourse = async (req: UserRequest, res: Response) => {
  // get required information (coursename, course code, batch, teacher);
  const { email, role } = req.user;
  const { courseName, teacherId, session, courseCode } = req.body;

  // varify given information
  if (authTester(role, "admin")) {
    if (!courseName || !teacherId || !session || !courseCode) {
      throw new ApiError(
        400,
        "Incomplete course information, please provide the full information.",
      );
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new ApiError(404, "The teacher is not available!");
    }

    // create course from the given information
    const createdCourse: CourseType = await Course.create({
      teacher: teacher._id,
      session,
      courseCode,
      name: courseName,
    });

    return res.status(200).json({
      success: true,
      course: createdCourse,
    });
  }
};

// get courses  for  a user.


// get course by ID  -> when you need a full page course detail

//
