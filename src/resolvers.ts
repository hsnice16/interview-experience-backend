import { GraphQLError } from "graphql";
import { blogs } from "./db/blogs.js";

export enum CustomErrorCodes {
  BAD_USER_INPUT = "BAD_USER_INPUT",
}

export const errorMsgs = {
  [CustomErrorCodes.BAD_USER_INPUT]: "Invalid argument value",
};

export const resolvers = {
  Query: {
    blogs: function (_, args) {
      if (args.limit <= 0) {
        throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
          extensions: {
            code: CustomErrorCodes.BAD_USER_INPUT,
            argumentName: "limit",
            reason: "statisfying limit <= 0",
          },
        });
      }

      if (args.offset < 0) {
        throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
          extensions: {
            code: CustomErrorCodes.BAD_USER_INPUT,
            argumentName: "offset",
            reason: "statisfying offset < 0",
          },
        });
      }

      return blogs.slice(args.offset, args.offset + args.limit);
    },
  },
};
