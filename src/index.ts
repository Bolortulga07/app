import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import jwt from "jsonwebtoken";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL as string).then(() => {
  console.log("connectod to Mongo.");
});

const app = express();

app.listen(4000, () => {
  console.log("server started on 4000");
});
