import { Categories } from "../model/categoryModel";

export const categoryMutations = {
  createCategory: async (
    _parent: null,
    args: { name: string; status: string; description: string }
  ) => {
    await Categories.create({
      name: args.name,
      status: args.status,
      description: args.description,
    });
    return "Category created.";
  },

  updateCategory: async (
    _parent: null,
    args: { name: string; status: string; description: string }
  ) => {
    await Categories.findOneAndUpdate(
      { name: args.name },
      {
        $set: args,
      }
    );
    return "Category is updated.";
  },
  deleteCategory: async (_parent: null, args: { id: string }) => {
    await Categories.findByIdAndDelete({ _id: args.id });
    return "Category is deleted.";
  },
};
