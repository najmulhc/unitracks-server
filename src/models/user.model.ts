const mongoose = require('mongoose')
import { UserType } from "../types";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    unique: true
  },
  hashedPassword: {
    type: String,
  },
  role: {
    enum: ["unassigned", "admin", "teacher", "student"],
  },
});

const User = mongoose.models.users || mongoose.model("user", userSchema);

export default User;
