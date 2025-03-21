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
import { Transactions } from "./modules/transaction/model/transactionModel";
import { Categories, ICategory } from "./modules/category/model/categoryModel";
import { IUser } from "./modules/user/model/userModel";

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
      id: ID!,
      username: String,
      email: String,
      password: String,
      transactionsForUser: [Transaction],  
      totalAmount: Int,
      totalIncomeExpense: [AmountType],
      transactionCount: Int.
    }

    type AmountType {
      income: Int
      expense: Int
    }
    
    type Category {
      name: String,
      status: String,
      description: String,
      transactionsForCategory:[Transaction],
      totalAmount:Int,
      totalIncomeExpense: [AmountType],
      transactionCount: Int
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
  Category: {
    transactionsForCategory: async (_parent: ICategory) => {
      return await Transactions.find({ categoryId: { $eq: _parent._id } });
    },
    totalAmount: async (parent: ICategory) => {
      const [test] = await Transactions.aggregate([
        {
          $match: {
            categoryId: parent._id,
          },
        },
        {
          $addFields: {
            totalAmount: {
              $sum: "$amount",
            },
          },
        },
        {
          $project: {
            totalAmount: 1,
          },
        },
      ]);

      return test.totalAmount;
    },

    totalIncomeExpense: async (_parent: ICategory) => {
      return await Transactions.aggregate([
        {
          $match: {
            categoryId: {
              $eq: _parent._id,
            },
          },
        },
        {
          $project: {
            income: {
              $sum: {
                $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
              },
            },
            expense: {
              $sum: {
                $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
              },
            },
          },
        },
      ]);
    },

    transactionCount: async (parent: ICategory) => {
      return await Transactions.countDocuments({ categoryId: parent.id });
    },
  },
  User: {
    transactionsForUser: async (parent: IUser) => {
      return await Transactions.find({ userId: parent.id });
    },

    totalAmount: async (parent: IUser) => {
      const [total] = await Transactions.aggregate([
        {
          $match: {
            userId: parent._id,
          },
        },
        {
          $addFields: {
            totalAmount: {
              $sum: "$amount",
            },
          },
        },
        {
          $project: {
            totalAmount: 1,
          },
        },
      ]);

      return total.totalAmount;
    },

    totalIncomeExpense: async (parent: IUser) => {
      return await Transactions.aggregate([
        {
          $match: {
            userId: parent.id,
          },
        },
        {
          $project: {
            income: {
              $sum: {
                $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
              },
            },
            expense: {
              $sum: {
                $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
              },
            },
          },
        },
      ]);
    },
    transactionCount: async (parent: IUser) => {
      return await Transactions.countDocuments({ userId: parent.id });
    },
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
