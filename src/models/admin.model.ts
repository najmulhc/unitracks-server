import mongoose, { Schema, model } from "mongoose";
import { AdminType } from "../types";

const adminSchema = new Schema<AdminType>({
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin",
  },
});

const Admin = mongoose.models.admin || model("admin", adminSchema);
export default Admin;
