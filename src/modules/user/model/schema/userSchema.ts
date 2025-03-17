import mongoose from "mongoose";
import { nanoid } from "nanoid";
const schema = mongoose.Schema;

export const userSchema = new schema(
  {
    _id: {
      type: String,
      default: nanoid(),
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },

    password: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

//export const User = mongoose.model<User>("User", userSchema);
