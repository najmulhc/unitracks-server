import mongoose, { Schema } from "mongoose";
import { Presentation as PresentationType } from "../../types";

const PresentationSchema = new Schema<PresentationType>({});

const Presentation = mongoose.model("Presentation", PresentationSchema);
export default Presentation;
