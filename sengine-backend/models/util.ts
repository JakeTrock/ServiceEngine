import mongoose, { Schema } from "mongoose";
import fuzzy from 'mongoose-fuzzy-search';
import { util } from "../types/types";

const utilSchema = new Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
    },
    binHash: {
      type: String,
      required: true,
    },
    binLoc: {
      type: String,
      required: true,
    },
    srcLoc:{
      type: String,
      required: true,
    },
    jsonLoc: {
      type: String,
      required: true,
    },
    uses: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
utilSchema.plugin(fuzzy, { fields: {
  description_tg: 'description'
} });
export default mongoose.model<util>("util", utilSchema);
