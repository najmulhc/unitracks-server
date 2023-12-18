import { Request } from "express";
import mongoose, { ObjectId, mongo } from "mongoose";

export type Role = "unassigned" | "admin" | "teacher" | "student";

export interface UserType {
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
  session: "2019" | "2020";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  dateOfBirth: number;
  firstName: string;
  lastName: string;
  courses: mongoose.Types.ObjectId[];
  email: string;
}

// not created the Schema
export interface TeacherType {
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
  title: string;
  time: number;
  setter: mongoose.Types.ObjectId; // the person set the notification
  for: mongoose.Types.ObjectId[];
  views: mongoose.Types.ObjectId[]; // if there is in view, that meens seen.
}

export interface QuestionType {
  question: string;
  options: string[];
  correctAnswer: number; // index of the right answer in the options
}

export interface StudentQuizType {
  student: mongoose.Types.ObjectId;
  attempted: number;
  correct: number;
  wrong: number;
  score: number;
}

export interface QuizType {
  teacher: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  questions: QuestionType[];
  participents: StudentQuizType[];
  name: string;
}

export interface CourseType {
  teacher: mongoose.Types.ObjectId;
  session: "2020" | "2021";
  students: [mongoose.Types.ObjectId];
  courseCode: 101 | 102 | 103 | 104 | 105;
  name: string;
  _id: ObjectId;
  resources: [mongoose.Types.ObjectId]
}

export interface AdminType {
  email: string;
  role: "admin";
}

export interface UserRequest extends Request {
  user: User;
  student?: StudentType;
  admin?: AdminType;
}

export interface ResourceType {
  title: string;
  link: string; // stored link
  teacher: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
}
