import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    createdAt: {
      type: String,
      timestamps: true,
    },
    updatedAt: {
      type: String,
      timestamps: true,
    },
  },
  { timestamps: true }
);

export const users = mongoose.model("user", userSchema);
