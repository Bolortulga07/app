import mongoose, { Model } from "mongoose";

import { categorySchema } from "./categorySchema";

interface ICategory {
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
