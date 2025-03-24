import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/schema";
import { queries } from "./graphql/queries";
import { mutations } from "./graphql/mutuations";
import { userResolvers } from "../modules/user/graphql/resolvers";
import { categoryResolvers } from "../modules/category/graphql/categoryResolvers";
import { transactionResolvers } from "../modules/transaction/graphql/transactionRevolvers";
import { IContext } from "../utils/@types";

const resolvers = {
  Query: {
    ...queries,
  },

  Mutation: {
    ...mutations,
  },

  User: {
    ...userResolvers,
  },

  Category: {
    ...categoryResolvers,
  },

  Transaction: {
    ...transactionResolvers,
  },
};

export const apolloServer = new ApolloServer<IContext>({
  typeDefs: typeDefs,
  resolvers,
});
