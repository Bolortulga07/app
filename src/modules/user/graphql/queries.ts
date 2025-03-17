import { Users } from "../model/userModel";
import { checkLogin } from "../../../utils/jwtUtils";

export const userQueriesTypeDepfs = `
  getProfile(username: String, email:String, id: ID!): String
`;

export const userQueries = {
  getProfile: async (_parent: null, _: undefined, { user }: any) => {
    checkLogin(user);
    return await Users.find(user);
  },
};
