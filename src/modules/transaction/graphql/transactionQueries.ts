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

  if (categoryIds && categoryIds.length) {
    filter["categoryId"] = { $in: categoryIds };
  }

  if (type) {
    filter["type"] = type;
  }

  if (minAmount !== undefined || maxAmount !== undefined) {
    filter["amount"] = {};
    if (minAmount !== undefined) filter["amount"].$gte = minAmount;
    if (maxAmount !== undefined) filter["amount"].$lte = maxAmount;
  }

  return filter;
};

export const transactionQueries = {
  getTransactions: async (_parent: null, args: any) => {
    const {
      limit = 20,
      page = 1,
      sortBy = "createdBy",
      sortOrder = -1,
      sortByDate,
      orderByDate,
    } = args;
    const skip = (page - 1) * limit;
    const filter = generateFilter(args);

    let sortOptions: Record<string, SortOrder> = { [sortBy]: sortOrder };

    if (sortByDate) {
      sortOptions = { [sortByDate]: orderByDate };
    }

    return await Transactions.find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sortOptions);
  },
};
