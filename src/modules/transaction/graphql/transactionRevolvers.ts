import { Categories } from "../../category/model/categoryModel";
import { ITransaction } from "../model/transactionModel";
import { Users } from "../../user/model/userModel";

export const transactionResolvers = {
  Transaction: {
    categoryOfTransaction: async (parent: ITransaction) => {
      return await Categories.findOne({ _id: parent.categoryId });
    },
    userOfTransaction: async (parent: ITransaction) => {
      return await Users.find({ transactionId: parent.id });
    },
  },
};
