import mongoose from "mongoose";
const { Schema } = mongoose;

const postSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    user: {
      type: { String },
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

export const post = mongoose.model("post", postSchema);
