import { userQueries } from "../../modules/user/graphql/queries";
import { catagoriesQueries } from "../../modules/category/graphql/categoryQueries";
import { transactionQueries } from "../../modules/transaction/graphql/transactionQueries";

export const queries = {
  Query: {
    ...userQueries,
    ...catagoriesQueries,
    ...transactionQueries,
  },
};
