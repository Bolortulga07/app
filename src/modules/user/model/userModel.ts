import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { userSchema } from "./userSchema";

interface IUser {
  username: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  register({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }): Promise<IUser>;
  login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<string>;
}

class User {
  getToken(this: IUser): string {
    const token = jwt.sign(
      { userId: mongoose.Types.ObjectId },
      process.env.SECRET_KEY as string
    );
    return token;
  }
  static async register(
    this: UserModel,
    {
      email,
      password,
      username,
    }: { email: string; password: string; username: string }
  ): Promise<IUser> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doc = {
      username,
      email,
      password: hashedPassword,
    };

    const user = await this.create(doc);
    return user;
  }
  static async login(
    this: UserModel,
    { email, password }: { email: string; password: string }
  ): Promise<string> {
    const user = await this.findOne({ email });

    if (!user) {
      throw new Error("Email is wrong");
    }

    const valid = bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Password is wrong");
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY as string
    );
    return token;
  }
}
userSchema.loadClass(User);

export const Users: UserModel = mongoose.model<IUser, UserModel>(
  "Users",
  userSchema
);
