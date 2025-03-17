import mongoose, { Model, Document } from "mongoose";

import { categorySchema } from "./categorySchema";

export interface ICategory extends Document {
  name: String;
  status: String;
  description: String;
}

interface CategoryModel extends Model<ICategory> {
  createCategory({
    name,
    status,
    description,
  }: {
    name: string;
    status: string;
    description: string;
  }): Promise<ICategory>;
}

class Category {
  static async createCategory(
    this: CategoryModel,
    {
      name,
      status,
      description,
    }: { name: string; status: string; description: string }
  ): Promise<ICategory> {
    const doc = {
      name,
      status,
      description,
    };

    const category = await this.create(doc);
    return category;
  }
}

categorySchema.loadClass(Category);

export const Categories: CategoryModel = mongoose.model<
  ICategory,
  CategoryModel
>("Categories", categorySchema);
