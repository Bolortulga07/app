import { authMutations } from "../../modules/auth/mutations/authMutations";
import { userMutations } from "../../modules/user/graphql/userMutations";
import { categoryMutations } from "../../modules/category/graphql/categoryMutations";
import { transactionMutations } from "../../modules/transaction/graphql/transactionMutations";

export const mutations = {
  Mutation: {
    ...authMutations,
    ...userMutations,
    ...categoryMutations,
    ...transactionMutations,
  },
};
