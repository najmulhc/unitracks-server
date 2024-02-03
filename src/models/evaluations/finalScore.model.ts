import mongoose, { Schema,  } from "mongoose";
import { FinalScore as FinalScoreType } from "./../../types.d";
const FinalScoreSchema = new Schema<FinalScoreType>({});

const FinalScore = mongoose.model("finalScore", FinalScoreSchema);

export default FinalScore;
