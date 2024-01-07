import mongoose, { Schema, model } from "mongoose";
import { ResourceType } from "../types";

const resourceSchema = new Schema<ResourceType>({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
});

const Resource = model("Resource", resourceSchema);

export default Resource;
