import mongoose, { Schema, model } from "mongoose";
import { AdminType } from "../types";

const adminSchema = new Schema<AdminType>({});

const Admin = mongoose.models.admin || model("admin", adminSchema);
export default Admin;
