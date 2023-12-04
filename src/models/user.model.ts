import mongoose from "mongoose";
import { UserType } from "../types";

const userSchema = new mongoose.Schema<UserType>({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: true,
  },
  hashedPassword: {
    type: String,
  },
  role: {
    type: String,
    enum: {
      values: ["unassigned", "admin", "teacher", "student"],
    },
    default: "unassigned",
  },
});

const User = mongoose.models.users || mongoose.model("user", userSchema);

export default User;
