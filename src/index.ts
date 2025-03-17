import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import jwt from "jsonwebtoken";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Context } from "./utils/@types";
import { authMutations } from "./modules/auth/mutations/authMutations";
import {
  userQueriesTypeDepfs,
  userQueries,
} from "./modules/user/graphql/queries";
import { userMutations } from "./modules/user/graphql/userMutations";
import { categoryMutations } from "./modules/category/graphql/categoryMutations";
import { transactionMutations } from "./modules/transaction/graphql/transactionMutations";
import {
  catagoriesQueries,
  categoryQueriesTypeDefs,
} from "./modules/category/graphql/categoryQueries";
import {
  transactionQueries,
  transactionQueriesTypeDefs,
} from "./modules/transaction/graphql/transactionQueries";

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
    
    type Category {
      name: String,
      status: String,
      description: String,
    }

    type Transaction {
      amount: Float,
      categoryId: String,
      date: String,
      description: String,
      type: String,
      userId: String,
  }

    type Query {
      ${userQueriesTypeDepfs}
      ${categoryQueriesTypeDefs}
      ${transactionQueriesTypeDefs}
    }

    type Mutation {
        register(username: String, email: String, password: String): User
        login(email: String, password: String) : String
        profileUpdate(username: String, email: String, newUsername: String): String
        createCategory(name: String!, status: String!, description: String!): Category
        updateCategory(name: String!, status: String!, description: String!): Category
        deleteCategory(id: ID!): Category  
        createTransaction(amount: Float!, categoryId: ID!, date: String!, description: String!, type: String!): Transaction
        updateTransaction(amount: Float!, categoryId: ID!, date: String!, description: String!, type: String!, userId: ID!): Transaction
        deleteTransaction(id: ID!): Transaction
    } 
`;

const resolvers = {
  Query: {
    ...userQueries,
    ...catagoriesQueries,
    ...transactionQueries,
  },
  Mutation: {
    ...authMutations,
    ...userMutations,
    ...categoryMutations,
    ...transactionMutations,
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
            const tokendata = jwt.verify(
              token,
              process.env.SECRET_KEY || ""
            ) as User;
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
