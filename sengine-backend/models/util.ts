import mongoose, { Schema } from "mongoose";

import { util } from "../types/types";

const utilSchema = new Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
    srcType:{
      type: String,
      required: true,
    },
    jsonHash: {
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

export default mongoose.model<util>("util", utilSchema);
