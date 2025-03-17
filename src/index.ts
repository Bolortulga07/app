import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import jwt from "jsonwebtoken";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Context } from "./utils/@types";
import { authMutations } from "./modules/auth/mutations/authMutations";

dotenv.config();

mongoose.connect(process.env.MONGO_URL as string).then(() => {
  console.log("connectod to Mongo.");
});

const app = express();

interface User {
  email: string;
  username: string;
  password: string;
}

const typeDefs = `
    type User {
        id: ID!
        username: String
        email: String
        password: String
    }

    type Query {
        test: String
    }

    type Mutation {
        register(username: String, email: String, password: String): User
        login(email: String, password: String) : String
    } 
`;

const resolvers = {
  Query: {
    test: () => {
      return "test";
    },
  },
  Mutation: {
    ...authMutations,
  },
};

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const token = req.headers.authorization;
        if (token) {
          try {
            const tokendata = jwt.verify(token, "123") as User;
            return { user: tokendata };
          } catch {
            return { user: null };
          }
        }

        return { user: null };
      },
    })
  );

  app.listen(4000, () => {
    console.log("server started on 4000");
  });
};

startServer();
