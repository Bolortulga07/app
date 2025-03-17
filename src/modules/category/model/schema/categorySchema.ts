import mongoose from "mongoose";
import { nanoid } from "nanoid";
const schema = mongoose.Schema;

export const categorySchema = new schema(
  {
    _id: {
      type: String,
      default: nanoid(),
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive"],
    },
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
