import mongoose from "mongoose";
import { commentSchema } from "./commentSchema.js";
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    caption: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    likes: {
      type: [String],
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "comments",
      },
    ],
    createdAt: {
      type: String,
    },
    updatedAt: {
      type: String,
    },
  },
  { timestamps: true }
);

export const posts = mongoose.model("posts", postSchema);
