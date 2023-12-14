import { Request } from "express";
import mongoose, { mongo } from "mongoose";

export type Role = "unassigned" | "admin" | "teacher" | "student";

export interface UserType {
  name?: string;
  hashedPassword: string;
  role: Role;
  email: string;
  details: mongoose.Schema.Types.ObjectId;
  refreshToken: string | undefined;
}

export interface StudentType {
  role: "student";
  authStage: "one" | "two" | "completed";
  roll: string;
  session: "2019" | "2020";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  dateOfBirth: number;
  firstName: string;
  lastName: string;
  courses: mongoose.Schema.Types.ObjectId[];
  email: string;
}

// not created the Schema
export interface TeacherType {
  firstName: string;
  lastName: string;
  email: string;
  courses: mongoose.Schema.Types.ObjectId[];
  role: "teacher";
  title: "Professor" | "Assistant Professor" | "Lecturer";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  authStage: "one" | "completed";
}

export interface NotificationType {
  title: string;
  time: number;
  setter: mongoose.Schema.Types.ObjectId; // the person set the notification
  for: mongoose.Schema.Types.ObjectId[];
  views: mongoose.Schema.Types.ObjectId[]; // if there is in view, that meens seen.
}

export interface QuestionType {
  question: string;
  options: string[];
  correctAnswer: number; // index of the right answer in the options
}

export interface StudentQuizType {
  student: mongoose.Schema.Types.ObjectId;
  attempted: number;
  correct: number;
  wrong: number;
  score: number;
}

export interface QuizType {
  teacher: mongoose.Schema.Types.ObjectId;
  course: mongoose.Schema.Types.ObjectId;
  questions: QuestionType[];
  participents: StudentQuizType[];
  name: string;
}

export interface CourseType {}

export interface AdminType {}

export interface UserRequest extends Request {
  user: User;
  student?: StudentType;
}
