import mongoose, { Schema } from "mongoose";
import { Presentation as PresentationType } from "../../types";

const PresentationSchema = new Schema<PresentationType>({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },
  topic: {
    type: String,
    required: [true, "Please provide the title of the presentation"],
  },
  description: {
    type: String,
    required: [true, "Please provide the description of the presentation"],
  },
  startingTime: {
    type: Number,
    min: 0,
    max: 100,
    required: [true, "Please provide the marks of the presentation"],
  },
  endingTime: {
    type: Number,
    min: 0,
    max: 100,
    required: [true, "Please provide the marks of the presentation"],
  },
  responses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "presentationResponse",
    },
  ],
});

const Presentation = mongoose.model("Presentation", PresentationSchema);
export default Presentation;
