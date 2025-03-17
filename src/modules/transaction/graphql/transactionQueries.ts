import { Transactions } from "../model/transactionModel";

export const transactionQueriesTypeDefs = `
  getTransactions: [Transaction],
  getTransaction(id: ID!): String,
`;

export const transactionQueries = {
  getTransactions: async (_parent: null) => {
    return await Transactions.find();
  },

  getTransaction: async (_parent: null, args: { id: string }) => {
    return await Transactions.findById({ _id: args.id });
  },
};
