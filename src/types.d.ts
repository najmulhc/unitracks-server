import mongoose from "mongoose";

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
};

export interface TeacherType {
  
}


export interface CourseType {}

export interface AdminType {}
