import mongoose, { Schema } from "mongoose";
import { PresentationResponse as PresentationResponseType } from "../../types";

const PresentationResponseSchema = new Schema<PresentationResponseType>({
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
  ],
  score: {
    type: Number,
    min: 0,
    max: 10, // it should be validated in the controller
    default: 0,
  },
  submissionTime: {
    type: Number,
    required: true,
  },
  isEvaluated: {
    type: Boolean,
    default: false,
  },
  presentationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "presentation",
  },
  answerScript: {
    video: {
      type: String,
      required: [true, "Please add the presentation video."],
    },
    slide: {
      type: String,
      required: [true, "Please add the presentation slide ppt/pdf."],
    },
  },
});

const PresentationResponse = mongoose.model(
  "Presentation",
  PresentationResponseSchema,
);
export default PresentationResponse;
