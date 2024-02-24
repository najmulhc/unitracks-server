import mongoose from "mongoose";

interface TeacherType {
  name: string;
  email: string;
  phone: string;
  department: string;
  university: "University of Dhaka";
  position:
    | "lecturer"
    | "assistant professor"
    | "associate professor"
    | "professor";
}

const TeacherReleaseSchema = new mongoose.Schema<TeacherType>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  phone: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: false,
    default: "University of Dhaka",
    enum: ["University of Dhaka"],
  },
  position: {
    type: String,
    required: true,
    enum: [
      "lecturer",
      "assistant professor",
      "associate professor",
      "professor",
    ],
  },
});

export default mongoose.model("TeacherRelease", TeacherReleaseSchema);
