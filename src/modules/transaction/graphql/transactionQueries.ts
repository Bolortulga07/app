import { FilterQuery, SortOrder } from "mongoose";
import { Transactions } from "../model/transactionModel";

export const transactionQueriesTypeDefs = `
  getTransactions(categoryId: String, categoryIds: [String], limit: Int, page: Int, skip: Int, sortBy: String, sortOrder: Int, type: String, sortByDate: String, orderByDate: Int, 
  minAmount: Int, maxAmount: Int): [Transaction],
  getTransaction(id: ID!): String,


  
`;

type TransactionFilter = {
  categoryId?: string;
  limit?: number;
  skip?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  type?: string;
  categoryIds?: string[];
  sortByDate?: string;
  orderByDate?: SortOrder;
  minAmount?: number;
  maxAmount?: number;
};

const generateFilter = (args: any) => {
  const {
    categoryId,
    limit = 20,
    page = 1,
    skip = (page - 1) * limit,
    sortBy = "createdBy",
    sortOrder = -1,
    type = "income",
    categoryIds = [],
    sortByDate = "createdBy",
    orderByDate = -1,
    minAmount,
    maxAmount,
  } = args;

  const filter: FilterQuery<TransactionFilter> = {};

  if (categoryId) {
    filter["categoryId"] = categoryId;
  }

  if (categoryIds.length) {
    filter["categoryId"] = { $in: categoryIds };
  }

  if (type) {
    filter["type"] = { $eq: type };
  }

  return filter;
};

export const transactionQueries = {
  getTransaction: async (_parent: null, args: { id: string }) => {
    return await Transactions.findById({ _id: args.id });
  },

  getTransactions: async (
    _parent: null,
    args: {
      categoryId: string;
      limit: number;
      skip: number;
      page: number;
      sortBy: string;
      sortOrder: SortOrder;
      type: string;
      categoryIds: string[];
      sortByDate: string;
      orderByDate: SortOrder;
      minAmount: number;
      maxAmount: number;
    }
  ) => {
    const {
      limit = 20,
      page = 1,
      skip = (page - 1) * limit,
      sortBy = "createdBy",
      sortOrder = -1,
    } = args;

    const filter: TransactionFilter = generateFilter(args);

    return await Transactions.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ [sortBy]: sortOrder });
    // .sort(type)
    // .select("-categoryId")
    // .find({ categoryId: { $in: categoryIds } })
    // .sort({ [sortByDate]: orderByDate })
    // .find({ amount: { $gte: minAmount } }, { amount: { $lte: maxAmount } });
  },
};
