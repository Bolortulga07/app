import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { route } from "./db/schemas/routes/routes.js";

dotenv.config();

const port = process.env.PORT || 3000;
const url = process.env.Database_URL;

mongoose.connect(url).then(() => {
  console.log("mongo connected");
});

const app = express();

app.use("/app", route);

app.listen(port, () => {
  console.log(`app running on ${port}`);
});
