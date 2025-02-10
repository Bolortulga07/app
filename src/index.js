import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { users } from "./db/schemas/userSchema.js";
import { posts } from "./db/schemas/postSchema.js";
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

app.post("/post", async (req, res) => {
  try {
    await posts.create({
      caption: "",
      imageUrl:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bluecross.org.uk%2Fadvice%2Fhorse%2Fwellbeing-and-care%2Fthe-field-kept-horse&psig=AOvVaw3LUrKyJ8sngz6dJtfrevQl&ust=1739277089639000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMDDq52OuYsDFQAAAAAdAAAAABAE",
      user: "67a9debd23fba7946a37d772",
      likes: ["Bat", "Tuya"],
      comments: ["Bat"],
    });
    res.send("success");
  } catch (e) {
    res.send(`errpr: ${e.message}`);
  }
});

app.listen(port, () => {
  console.log(`app running on ${port}`);
});
