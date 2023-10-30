export interface UserType {
  name?: string;
  hashedPassword: string;
  role: "unassigned" | "admin" | "teacher" | "student";
  email: string;
}

export interface AdminType extends UserType {
 role: "admin"
}

export interface TeacherType extends UserType {}
export interface StudentType extends UserType {}