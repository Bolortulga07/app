import { Transactions } from "../../transaction/model/transactionModel";
import { IUser } from "../model/userModel";

export const userResolvers = {
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
