import mongoose from "mongoose";
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
    comments: {
      type: [String],
    },
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
