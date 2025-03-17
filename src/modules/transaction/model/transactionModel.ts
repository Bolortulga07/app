import mongoose, { Model } from "mongoose";
import { transactionSchema } from "./transactionSchema";

interface ITransaction {
  amount: Number;
  categoryId: String;
  date: String;
  description: String;
  type: String;
  userId: String;
}

interface transactionModel extends Model<ITransaction> {
  createTransaction({
    amount,
    categoryId,
    date,
    description,
    type,
    userId,
  }: {
    amount: number;
    categoryId: string;
    date: string;
    description: string;
    type: string;
    userId: string;
  }): Promise<ITransaction>;
}

class Transaction {
  static async createTransaction(
    this: transactionModel,
    {
      amount,
      categoryId,
      date,
      description,
      type,
      userId,
    }: {
      amount: number;
      categoryId: string;
      date: string;
      description: string;
      type: string;
      userId: string;
    }
  ): Promise<ITransaction> {
    const doc = {
      amount,
      categoryId,
      date,
      description,
      type,
      userId,
    };
    const transaction = await this.create(doc);
    return transaction;
  }
}

transactionSchema.loadClass(Transaction);

export const Transactions: transactionModel = mongoose.model<
  ITransaction,
  transactionModel
>("Transactions", transactionSchema);
