import mongoose, { Schema } from "mongoose";
import { PresentationResponse as PresentationResponseType } from "../../types";

const PresentationResponseSchema = new Schema<PresentationResponseType>({});

const PresentationResponse = mongoose.model(
  "Presentation",
  PresentationResponseSchema,
);
export default PresentationResponse;
