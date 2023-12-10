import { checkLimitValue, checkOffsetValue } from "./index";
import { logger } from "../utils";
import { Blogs } from "../db";

export async function getBlogs(args) {
  logger("-- getBlogs : START --");

  checkLimitValue(args.limit);
  checkOffsetValue(args.offset);

  const blogs = await Blogs.get(
    args.limit,
    args.offset,
    args.filter?.forOrganization
  );

  logger("-- getBlogs : END --");

  return blogs.map((blog) => {
    const { _id, title, link, organisation_name, author_name, author_profile } =
      blog;

    return {
      _id,
      title,
      link,
      forOrganization: organisation_name,
      author: {
        name: author_name,
        profile: author_profile,
      },
    };
  });
}
