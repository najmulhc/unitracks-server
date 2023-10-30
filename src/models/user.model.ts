import mongoose, { Model, Schema, models } from "mongoose";
import { UserType } from "../types";

const userSchema = new Schema<UserType>({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
  },
  hashedPassword: {
    type: String,
  },
  role: {
    enum: ["unassigned", "admin", "teacher", "student"],
  },
});

const User = models.users || mongoose.model("user", userSchema);

export default User;
