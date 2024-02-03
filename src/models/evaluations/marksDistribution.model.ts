import { MarksDistribution } from "./../../types.d";
import mongoose, { Schema } from "mongoose";
import { MarksDistribution as MarksDistributionType } from "../../types";

const MarksDistributionSchema = new Schema<MarksDistributionType>({});

const MarksDistribution = mongoose.model(
  "marksDistribution",
  MarksDistributionSchema,
);

export default MarksDistribution;
