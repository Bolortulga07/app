import { Users } from "../../user/model/userModel";

interface User {
  username: string;
  email: string;
  password: string;
}

export const authMutations = {
  register: async (_parent: undefined, { username, email, password }: User) => {
    return await Users.register({ username, email, password });
  },

  login: async (_parent: undefined, { email, password }: User) => {
    return await Users.login({ email, password });
  },
};
