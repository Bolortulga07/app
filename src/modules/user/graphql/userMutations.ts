import { Users } from "../model/userModel";

export const userMutations = {
  profileUpdate: async (
    _parent: null,
    args: { username: string; newUsername?: string; email: string }
  ) => {
    await Users.findOneAndUpdate(
      { username: args.username },
      {
        $set: {
          ...(args.newUsername && { username: args.newUsername }),
          ...(args.email && { email: args.email }),
        },
      },
      { new: true }
    );
    return "Users profile updated.";
  },
};
