import { Users } from "../model/userModel";
import { checkLogin } from "../../../utils/jwtUtils";

export const userQueriesTypeDepfs = `
  getProfile(username: String, email:String, id: ID!): String
`;

export const userQueries = {
  getProfile: async (_parent: null, args: { id: string }, { user }: any) => {
    checkLogin(user);
    return await Users.findById(args.id);
  },
};
