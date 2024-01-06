import { Request, Response, request } from "express";
import { CourseType, TeacherType, UserRequest } from "../types";
import authTester from "../utils/authTester.util";
import ApiError from "../utils/ApiError.util";
import Teacher from "../models/teacher.model";
import Course from "../models/course.model";
import Student from "../models/student.model";
import ApiResponse from "../utils/ApiResponse.util";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { deleteImage, uploadImage } from "../utils/uploadImage";
import { createNotification } from "./notificationController";
import courseTeacherTester from "../utils/courseTeacherTester";

export const createCourse = async (req: UserRequest, res: Response) => {
  // get required information (coursename, course code, batch, teacher);
  const { email, role } = req.user;
  const { courseName, session, courseCode } = req.body;

  // varify given information
  if (authTester(role, "admin")) {
    if (!courseName || !session || !courseCode) {
      throw new ApiError(
        400,
        "Incomplete course information, please provide the full information.",
      );
    }

    // create course from the given information
    const createdCourse: CourseType = await Course.create({
      session,
      courseCode,
      name: courseName,
    });
    const notification = await createNotification({
      creator: req.user._id,
      sessions: [session],
      text: `Successfully Enrolled to the course ${createdCourse.name}`,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          course: createdCourse,
        },
        "Successfully created the course.",
      ),
    );
  }
};

// assign a teacher to the course
export const assignTeacher = async (req: UserRequest, res: Response) => {
  const { role } = req.user;
  authTester(role, "admin");
  const { teacherId } = req.body;
  const { courseId } = req.params;
  const course: CourseType | null = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "No course found with this id");
  }
  if (course.teacher) {
    throw new ApiError(
      401,
      "You have already assigned a teacer to the course.",
    );
  }
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    throw new ApiError(404, "No teacher found with this id.");
  }

  // now we have the teacher, and a course that has no teacher assigned
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    {
      $set: {
        teacher: teacherId,
      },
    },
    {
      new: true,
    },
  );

  if (!updatedCourse) {
    throw new ApiError(500, "there was an error updating the course");
  }

  const notification = await createNotification({
    text: `You have been assignd as a teacher of the course titled ${course.name}`,
    userId: teacher._id,
    creator: req.user._id,
  });
  res.status(200).json(
    new ApiResponse(
      200,
      {
        course: updatedCourse,
      },
      "The teacher has been assigned",
    ),
  );
};

// get all courses by admin
export const getAllCourses = async (req: UserRequest, res: Response) => {
  if (!req.admin) {
    throw new ApiError(403, "You do not have permission to perform this task.");
  }

  const courses = await Course.find().select("-students -teacher");
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courses,
      },
      "Successfully found all courses.",
    ),
  );
};

// get courses  for  a user.
export const getCourses = async (req: UserRequest, res: Response) => {
  const { email, role } = req.user;
  if (role === "student") {
    const student = await Student.findOne({
      email,
    }).populate("courses");

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          courses: student?.courses,
        },
        "Response with all courses of the student.",
      ),
    );
  } else if (role === "teacher") {
    const teacher = await Teacher.findOne({
      email,
    }).populate("courses");

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          courses: await Course.find({
            teacher: teacher?._id,
          }).populate("teacher"),
        },
        "Response with all courses of the teacher.",
      ),
    );
  } else {
    throw new ApiError(400, "Invalid user type.");
  }
};

export const getCourseById = async (req: UserRequest, res: Response) => {
  const { courseId } = req.params;
  const { role, email } = req.user;

  // when you are a teacher and want to access the course
  if (role === "teacher") {
    const teacher = await Teacher.findOne({
      email: req.user.email,
    });
    const course = await Course.findById(courseId).populate({
      path: "students",
      select: "firstName lastName -_id roll",
    });

    if (!course) {
      throw new ApiError(404, "Course not found.");
    }
    //@ts-ignore
    if (course?.teacher?._id === teacher?._id) {
      // testing if the teacher has access to the course
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            course,
          },
          "Course for the teacher is ready.",
        ),
      );
    } else {
      throw new ApiError(
        401,
        "You do not have access to the course as a teacher.",
      );
    }
  } else if (role === "student") {
    // route handler for a student
    const student = await Student.findOne({
      email,
    });
    if (student?.courses.includes(new mongoose.Types.ObjectId(courseId))) {
      const course = await Course.findById(courseId)
        .populate("resource")
        .select("-students")
        .populate("teacher");

      if (!course) {
        throw new ApiError(404, "Course not found.");
      }
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { course },
            "Course for the student found successfully",
          ),
        );
    } else {
      throw new ApiError(403, "You do not have access to the course.");
    }
  } else if (role === "admin") {
    const course = await Course.findById(courseId)
      .populate({
        path: "students",
        select: "firstName lastName -_id roll",
      })
      .populate({
        path: "teacher",
        select: "firstName lastName title -_id",
      });
    if (!course) {
      throw new ApiError(404, "Course not found.");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          course,
        },
        "Course for admin found successfully!",
      ),
    );
  } else {
    throw new ApiError(403, "Unauthorized access to the course.");
  }
};

// upload the cover image of the course

export const uploadCourseCoverImage = async (
  req: UserRequest,
  res: Response,
) => {
  const { role } = req.user;
  authTester(role, "admin");
  const coverImageLocalPath = req.file?.path;
  const uploadedUrl = await uploadImage(coverImageLocalPath as string);
  res.status(200).json(
    new ApiResponse(
      200,
      {
        coverImageLocalPath,
        uploadedUrl,
      },
      "we got the local path of the image. ",
    ),
  );
};

export const deleteCourse = async (req: UserRequest, res: Response) => {
  // test if he is the admin
  const { role } = req.user;
  authTester(role, "admin");
  // test if the course exists.
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "No course found to delete");
  }
  // delete the cover photo of the course
  const { coverImage } = course;
  const deleted = await deleteImage(coverImage);
  // delete all the resources of the course

  // delete the course by Id.
  const deletedCourse = await Course.findByIdAndDelete(courseId);
  // return the response
  res
    .status(200)
    .json(new ApiResponse(200, {}, "successfully deleted the course"));
};

 
export const uploadTextBook = async (req: UserRequest, res: Response) => {
 
  const { role, email } = req.user;
  authTester(role, "teacher");
  const { courseId, textbookUrl } = req.body;

  if (!courseId) {
    throw new ApiError(400, "No course id given");
  }
  const course: CourseType = await courseTeacherTester({
    courseId,
    teacherEmail: email,
  });
  const updatedCourse = await Course.updateOne(
    { _id: course._id },
    {
      $push: {
        textBook: textbookUrl,
      },
    },
    { new: true },
  );
  if (!updatedCourse) {
    throw new ApiError(500, "There was an error to upload the textbook url.");
  } else {
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Successfully updated the textbook."));
  }
};
