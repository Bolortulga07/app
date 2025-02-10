import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const port = process.env.Port || 3000;
const url = process.env.Database_URL;

mongoose.connect(url).then(() => {
  console.log("mongo connected");
});

const app = express();

app.listen(port, () => {
  console.log(`app running on ${port}`);
});
