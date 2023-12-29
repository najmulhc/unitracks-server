import mongoose, { Model, Schema } from "mongoose";
import { CourseColorType } from "../types";

const courseColorSchema = new Schema<CourseColorType>({
  code: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (value: string) {
        const regex = /^#([0-9a-fA-F]{3}){1,2}$/;
        return regex.test(value)
      },
      message: "Invalid hex code of Color Given!"
    },
  },
});


const CourseColor = mongoose.model("CourseColor", courseColorSchema) ;

export default CourseColor;