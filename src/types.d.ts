export interface UserType {
  name?: string;
  hashedPassword: string;
  role: "unassigned" | "admin" | "teacher" | "student";
  email: string;
}

export interface StudentType extends UserType {
  role: "student";
  authStage: "1"| "2", "completed",
  roll: number, 
  session: "2019"| "2020" 
}
