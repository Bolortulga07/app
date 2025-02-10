import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { users } from "./db/schemas/userSchema.js";
import { post } from "./db/schemas/postSchema.js";
import { comments } from "./db/schemas/commentSchema.js";

dotenv.config();

const port = process.env.PORT || 3000;
const url = process.env.Database_URL;

mongoose.connect(url).then(() => {
  console.log("mongo connected");
});

const app = express();

app.post("/user", async (req, res) => {
  try {
    await users.create({
      username: "Bilguun",
      profilePic: "1",
      followers: ["Bilguun", "Tuya", "Khaliun"],
      following: ["Bilguun", "Bat", "Saraa"],
    });
    res.send("succes");
  } catch (e) {
    res.send(`error: ${e.message}`);
  }
});

app.get("/user", async (req, res) => {
  const user = await users.find({ username: "Bilguun" });

  res.send(user);
});

app.post("/follow", async (req, res) => {
  const user = await users.findOneAndUpdate(
    { username: "Bilguun" },
    { $push: { followers: "Bat" } }
  );
  res.send(user);
});

app.post("/unfollow", async (req, res) => {
  const user = await users.findOneAndUpdate(
    { username: "Bilguun" },
    { $pull: { followers: "Bat" } }
  );
  res.send(user);
});

app.get("/users-followers", async (req, res) => {
  const user = await users.find({ username: "Bilguun" }, { followers: 1 });

  res.send(user);
});

app.get("/followedBy", async (req, res) => {
  const user = await users.find({ username: "Bilguun" }, { following: 1 });

  res.send(user);
});

app.listen(port, () => {
  console.log(`app running on ${port}`);
});
