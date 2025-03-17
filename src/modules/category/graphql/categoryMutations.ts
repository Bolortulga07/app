import { Categories } from "../model/categoryModel";

export const categoryMutations = {
  createCategory: async (
    _parent: null,
    args: { name: string; status: string; description: string }
  ) => {
    const createdCategory = await Categories.create({
      name: args.name,
      status: args.status,
      description: args.description,
    });
    return createdCategory;
  },

  updateCategory: async (
    _parent: null,
    args: { name: string; status: string; description: string }
  ) => {
    const updatedCategory = await Categories.findOneAndUpdate(
      { name: args.name },
      {
        $set: args,
      }
    );
    return updatedCategory;
  },
  deleteCategory: async (_parent: null, args: { id: string }) => {
    const deletedCategory = await Categories.findByIdAndDelete({
      _id: args.id,
    });
    return deletedCategory;
  },
};
