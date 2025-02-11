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
  const username = req.query;
  const profile = req.query;

  try {
    await users.create({
      username: username,
      profilePic: profile,
    });
    res.send("success");
  } catch (e) {
    res.send(`error: ${e.message}`);
  }
});

app.get("/user", async (req, res) => {
  const { username } = req.query;
  console.log(username);
  const user = await users.find({ username: username });

  res.send(user);
});

app.post("/follow", async (req, res) => {
  const { username, followerId } = req.query;

  const user = await users.findOneAndUpdate(
    { username: username },
    { $push: { followers: followerId } }
  );
  res.send("success");
});

app.post("/following", async (req, res) => {
  const { username, followerId } = req.query;

  const user = await users.findOneAndUpdate(
    { username: username },
    { $push: { following: followerId } }
  );
  res.send("success");
});

app.post("/unfollow", async (req, res) => {
  const { username, followerId } = req.query;

  const user = await users.findOneAndUpdate(
    { username: username },
    { $pull: { followers: followerId } }
  );
  res.send(user);
});

app.get("/users-followers", async (req, res) => {
  const { username } = req.query;
  const user = await users.find({ username: username }, { followers: 1 });

  res.send(user);
});

app.get("/followedBy", async (req, res) => {
  const { username } = req.query;
  const user = await users.find({ username: username }, { following: 1 });

  res.send(user);
});

app.post("/post", async (req, res) => {
  const { username, caption } = req.query;

  try {
    await posts.create({
      caption: caption,
      imageUrl:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bluecross.org.uk%2Fadvice%2Fhorse%2Fwellbeing-and-care%2Fthe-field-kept-horse&psig=AOvVaw3LUrKyJ8sngz6dJtfrevQl&ust=1739277089639000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMDDq52OuYsDFQAAAAAdAAAAABAE",
      user: username,
      likes: [],
    });
    res.send("success");
  } catch (e) {
    res.send(`error: ${e.message}`);
  }
});

app.get("/post", async (req, res) => {
  const post = await posts.find().populate("comments");

  res.send(post);
});

app.get("/singlePost", async (req, res) => {
  const { username } = req.query;
  const post = await posts.findOne({ user: username }).populate("comments");
  res.send(post);
});

app.delete("/postId", async (req, res) => {
  const { username } = req.query;
  const post = await posts.find().deleteOne({ user: username });
  res.send("post deleted.");
});

app.post("/like", async (req, res) => {
  const { username, like } = req.query;
  const post = await posts.findOneAndUpdate(
    { user: username },
    { $push: { likes: like } }
  );
  res.send("like added.");
});

app.post("/likeDel", async (req, res) => {
  const { username, like } = req.query;
  const post = await posts.findOneAndUpdate(
    { user: username },
    { $pull: { likes: like } }
  );
  res.send("like deleted.");
});

app.post("/comment", async (req, res) => {
  const { username, comment, id } = req.query;
  try {
    const newComment = await comments.create({
      user: username,
      text: comment,
    });
    const commentAdd = await posts.findOneAndUpdate(
      { _id: id },
      { $push: { comments: newComment } }
    );
    console.log(comment);
    res.send("success");
  } catch (e) {
    console.log(`error: ${e.message}`);
  }
});

app.delete("/comment", async (req, res) => {
  const { id, postId } = req.query;
  const comment = await comments.deleteOne({ _id: id });
  const commentAdd = await posts.findOneAndUpdate(
    { _id: postId },
    { $pull: { comments: id } }
  );
  res.send("comment deleted.");
});

app.get("/feed", async (req, res) => {
  const post = await users.find();
});

app.listen(port, () => {
  console.log(`app running on ${port}`);
});
