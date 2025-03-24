import { userQueriesTypeDepfs } from "../../modules/user/graphql/queries";
import { categoryQueriesTypeDefs } from "../../modules/category/graphql/categoryQueries";
import { transactionQueriesTypeDefs } from "../../modules/transaction/graphql/transactionQueries";

export const typeDefs = `
    type User {
      id: ID!,
      username: String,
      email: String,
      password: String,
      transactionsForUser: [Transaction],  
      totalAmount: Int,
      totalIncomeExpense: [AmountType],
      transactionCount: Int
    }

    type AmountType {
      income: Int
      expense: Int
    }
    
    type Category {
      _id: String,
      name: String,
      status: String,
      description: String,
      transactionsForCategory:[Transaction],
      totalAmount:Int,
      totalIncomeExpense: [AmountType],
      transactionCount: Int
    }

    type Transaction {
      amount: Float,
      categoryId: String,
      date: String,
      description: String,
      type: String,
      userId: String,
      categoryOfTransaction: Category,
      userOfTransaction: [User],
  }

    type Query {
      ${userQueriesTypeDepfs}
      ${categoryQueriesTypeDefs}
      ${transactionQueriesTypeDefs}
    }

    type Mutation {
        register(username: String, email: String, password: String): User
        login(email: String, password: String) : String
        profileUpdate(username: String, email: String, newUsername: String): String
        createCategory(name: String!, status: String!, description: String!): Category
        updateCategory(name: String!, status: String!, description: String!): Category
        deleteCategory(id: ID!): Category  
        createTransaction(amount: Float!, categoryId: ID!, date: String!, description: String!, type: String!): Transaction
        updateTransaction(amount: Float!, categoryId: ID!, date: String!, description: String!, type: String!, userId: ID!): Transaction
        deleteTransaction(id: ID!): Transaction
    } 
`;
