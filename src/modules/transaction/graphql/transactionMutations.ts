import { Transactions } from "../model/transactionModel";

export const transactionMutations = {
  createTransaction: async (
    _parent: null,
    args: {
      amount: Number;
      categoryId: String;
      date: String;
      description: String;
      type: String;
      userId: String;
    }
  ) => {
    await Transactions.create({
      amount: args.amount,
      categoryId: args.categoryId,
      date: args.date,
      description: args.description,
      type: args.type,
      userId: args.userId,
    });
    return "Transaction is created.";
  },

  updateTransaction: async (
    _parent: null,
    args: {
      id: string;
      amount: Number;
      categoryId: String;
      date: String;
      description: String;
      type: String;
      userId: String;
    }
  ) => {
    await Transactions.findOneAndUpdate({ _id: args.id }, { $set: args });
    return "Transaction is updated.";
  },

  deleteTransaction: async (_parent: null, args: { id: string }) => {
    await Transactions.findByIdAndDelete({ _id: args.id });
    return "Transaction is deleted.";
  },
};
