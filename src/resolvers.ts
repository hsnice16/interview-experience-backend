import { GraphQLError } from "graphql";
import { blogs } from "./db/blogs";
import { organisations } from "./db/organisations";

export enum CustomErrorCodes {
  BAD_USER_INPUT = "BAD_USER_INPUT",
}

export const errorMsgs = {
  [CustomErrorCodes.BAD_USER_INPUT]: "Invalid argument value",
};

function checkLimitValue(limit?: number) {
  if (limit && limit <= 0) {
    throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
      extensions: {
        code: CustomErrorCodes.BAD_USER_INPUT,
        argumentName: "limit",
        reason: "statisfying limit <= 0",
      },
    });
  }
}

function checkOffsetValue(offset?: number) {
  if (offset && offset < 0) {
    throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
      extensions: {
        code: CustomErrorCodes.BAD_USER_INPUT,
        argumentName: "offset",
        reason: "statisfying offset < 0",
      },
    });
  }
}

export const resolvers = {
  Query: {
    blogs: function (_, args) {
      if (args.filter?.forOrganisation) {
        return blogs.filter(
          (blog) => blog.forOrganisation === args.filter.forOrganisation
        );
      }

      checkLimitValue(args.limit);
      checkOffsetValue(args.offset);

      return blogs.slice(args.offset, args.offset + args.limit);
    },

    organisations: function (_, args) {
      checkLimitValue(args.limit);
      checkOffsetValue(args.offset);

      return organisations.slice(args.offset, args.offset + args.limit);
    },
  },
};
