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
      caption: "AAA",
      imageUrl:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bluecross.org.uk%2Fadvice%2Fhorse%2Fwellbeing-and-care%2Fthe-field-kept-horse&psig=AOvVaw3LUrKyJ8sngz6dJtfrevQl&ust=1739277089639000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMDDq52OuYsDFQAAAAAdAAAAABAE",
      user: "67a9debd23fba7946a37d772",
    });
    res.send("success");
  } catch (e) {
    res.send(`error: ${e.message}`);
  }
});

app.get("/post", async (req, res) => {
  const post = await posts.find();
  res.send(post);
});

app.get("/singlePost", async (req, res) => {
  const post = await posts.findOne({ user: "67a9debd23fba7946a37d772" });
  res.send(post);
});

app.delete("/postId", async (req, res) => {
  const post = await posts
    .find()
    .deleteOne({ user: "67a9debd23fba7946a37d772" });
  res.send("post deleted.");
});

app.post("/like", async (req, res) => {
  const post = await posts.findOneAndUpdate(
    { user: "67a9debd23fba7946a37d772" },
    { $push: { likes: "Saraa" } }
  );
  res.send("like added.");
});

app.post("/likeDel", async (req, res) => {
  const post = await posts.findOneAndUpdate(
    { user: "67a9debd23fba7946a37d772" },
    { $pull: { likes: "Tuya" } }
  );
  res.send("like deleted.");
});

app.post("/comment", async (req, res) => {
  try {
    const comment = await comments.create({
      user: "67a9debd23fba7946a37d772",
      text: "nice photo.",
    });
    const commentAdd = posts.findOneAndUpdate(
      { user: "67a9debd23fba7946a37d772" },
      { $push: comment }
    );
    res.send("success");
  } catch (e) {
    console.log(`error: ${e.message}`);
  }
});

app.delete("/comment", async (req, res) => {
  const comment = await comments
    .find()
    .deleteOne({ user: "67a9debd23fba7946a37d772" });
  res.send("comment deleted.");
});

app.listen(port, () => {
  console.log(`app running on ${port}`);
});
