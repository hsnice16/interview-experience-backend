import { StagingBlogs } from "../db";
import { logger } from "../utils";
import { checkAuthorization } from "./index";

export async function getStagingBlogs(args) {
  logger("--- getStagingBlogs : START ---");

  checkAuthorization(args.messageCode);

  const stagingBlogs = await StagingBlogs.get(args.status);

  logger("--- getStagingBlogs : END ---");

  return stagingBlogs.map((blog) => {
    const {
      _id,
      title,
      link,
      organisation_name,
      author_name,
      author_profile,
      status,
    } = blog;

    return {
      _id,
      title,
      link,
      forOrganization: organisation_name,
      author: {
        name: author_name,
        profile: author_profile,
      },
      status,
    };
  });
}
