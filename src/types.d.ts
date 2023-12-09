import mongoose, { mongo } from "mongoose";

export interface UserType {
  name?: string;
  hashedPassword: string;
  role: "unassigned" | "admin" | "teacher" | "student";
  email: string;
  details: mongoose.Schema.Types.ObjectId;
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
}

export interface CourseType {}

export interface AdminType {}
