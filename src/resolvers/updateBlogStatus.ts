import { GraphQLError } from "graphql";
import { Authors, Organisations, StagingBlogs, Blogs } from "../db";
import { logger } from "../utils";
import { CustomErrorCodes, checkAuthorization, errorMsgs } from "./index";

export async function updateBlogStatus(args) {
  logger("-- updateBlogStatus : START --");

  checkAuthorization(args.messageCode);

  const isBlogExist = await StagingBlogs.exist(args._id);

  if (!isBlogExist) {
    throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
      extensions: {
        code: CustomErrorCodes.BAD_USER_INPUT,
        argumentName: "_id",
        reason: "no blog with the given _id exists",
      },
    });
  }

  if (!["approved", "rejected"].includes(args.status)) {
    throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
      extensions: {
        code: CustomErrorCodes.BAD_USER_INPUT,
        argumentName: "status",
        reason: "status can be approved or rejected only",
      },
    });
  }

  if (args.status === "rejected") {
    const blog = await StagingBlogs.update(args._id, "rejected");

    logger("-- updateBlogStatus (rejected) : END --");

    return blog;
  }

  const blog = await StagingBlogs.delete(args._id);
  const organisation = await Organisations.find(blog.organisation_name);
  let organisationId = organisation?._id;

  if (!organisation) {
    await Organisations.update(organisationId, organisation.blogsCount + 1);
  } else {
    const { _id } = await Organisations.insert(blog.organisation_name, 1);
    organisationId = _id;
  }

  const author = await Authors.find(blog.author_name, blog.author_profile);
  let authorId = author?._id;

  if (!authorId) {
    const { _id } = await Authors.insert(blog.author_name, blog.author_profile);
    authorId = _id;
  }

  await Blogs.insert(blog.title, blog.link, organisationId, authorId);

  logger("-- updateBlogStatus : END --");

  return {
    _id: blog._id,
    title: blog.title,
    link: blog.link,
    forOrganization: blog.organisation_name,
    author: {
      name: blog.author_name,
      process: blog.author_profile,
    },
    status: "approved",
  };
}
