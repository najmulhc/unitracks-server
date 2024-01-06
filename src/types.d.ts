import { Request } from "express";
import mongoose, { ObjectId, mongo } from "mongoose";

export type Role = "unassigned" | "admin" | "teacher" | "student";

export interface UserType {
  _id: ObjectId;
  name?: string;
  hashedPassword: string;
  role: Role;
  email: string;
  details: mongoose.Types.ObjectId;
  refreshToken: string | undefined;
}

export interface StudentType {
  role: "student";
  authStage: "one" | "two" | "completed";
  roll: string;
  session: "2021" | "2020";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  dateOfBirth: number;
  firstName: string;
  lastName: string;
  courses: mongoose.Types.ObjectId[];
  email: string;
  _id: mongoose.Schema.Types.ObjectId;
}

// not created the Schema
export interface TeacherType {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  courses: mongoose.Types.ObjectId[];
  role: "teacher";
  title: "Professor" | "Assistant Professor" | "Lecturer";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  authStage: "one" | "completed";
}

export interface NotificationType {
  _id: ObjectId;
  title: string;
  time: number;
  setter: mongoose.Types.ObjectId; // the person set the notification
  studentsFor: mongoose.Types.ObjectId[];
  views: mongoose.Schema.Types.ObjectId[]; // if there is in view, that meens seen.
}

export interface QuestionType {
  _id: ObjectId;
  question: string;
  options: string[];
  correctAnswer: number; // index of the right answer in the options
}

export interface StudentQuizType {
  _id: ObjectId;
  student: mongoose.Types.ObjectId;
  attempted: number;
  correct: number;
  wrong: number;
  score: number;
}

export interface QuizType {
  _id: ObjectId;
  teacher: mongoose.Types.ObjectId;
  course: mongoose.Schema.Types.ObjectId;
  questions: QuestionType[];
  participents: StudentQuizType[];
  name: string;
}

export interface CourseType {
  teacher: mongoose.Schema.Types.ObjectId | TeacherType;
  session: "2020" | "2021";
  students: [mongoose.Schema.Types.ObjectId];
  courseCode: number;
  name: string;
  _id: ObjectId;
  resources: [mongoose.Types.ObjectId];
  coverImage: string;

  textBook: [string];
}

export interface AdminType {
  email: string;
  _id: ObjectId;
  role: "admin";
}

export interface UserRequest extends Request {
  user: UserType;
  student?: StudentType;
  admin?: AdminType;
  teacher?: TeacherType;
  course?: CourseType;
}

export interface ResourceType {
  title: string;
  link: string; // stored link
  teacher: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  _id: ObjectId;
}

export interface CourseColorType {
  code: string;
}
