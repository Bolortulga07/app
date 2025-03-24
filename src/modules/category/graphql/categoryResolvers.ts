import { Transactions } from "../../transaction/model/transactionModel";
import { ICategory } from "../model/categoryModel";

export const categoryResolvers = {
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
};
