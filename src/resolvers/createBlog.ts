import { GraphQLError } from "graphql";
import { Blogs, StagingBlogs } from "../db";
import { logger } from "../utils";
import { CustomErrorCodes, checkAuthorization, errorMsgs } from "./index";

export async function createBlog(args) {
  const {
    messageCode,
    title,
    link,
    forOrganization,
    author: { name, profile },
  } = args;
  logger("-- createBlog: START --");

  checkAuthorization(messageCode);

  const isBlogExist = await Blogs.exist(
    title,
    link,
    forOrganization,
    name,
    profile
  );

  if (isBlogExist) {
    throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
      extensions: {
        code: CustomErrorCodes.BAD_USER_INPUT,
        argumentName:
          "title, link, forOrganization, author.name, author.profile",
        reason: "blog with same info already exists",
      },
    });
  }

  const { _id } = await StagingBlogs.insert(
    title,
    link,
    forOrganization,
    name,
    profile,
    "pending"
  );

  logger("-- createBlog: END --");

  return {
    _id,
    title,
    link,
    forOrganization,
    author: { name, profile },
    status: "pending",
  };
}
