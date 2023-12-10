import { createBlog } from "./createBlog";
import { getBlogs } from "./getBlogs";
import { getOrganisations } from "./getOrganisations";
import { getStagingBlogs } from "./getStagingBlogs";
import { updateBlogStatus } from "./updateBlogStatus";

export const resolvers = {
  Query: {
    blogs: async function (_, args) {
      return await getBlogs(args);
    },

    organizations: async function (_, args) {
      return await getOrganisations(args);
    },

    stagingBlogs: async function (_, args) {
      return await getStagingBlogs(args);
    },
  },
  Mutation: {
    createBlog: async function (_, args) {
      return await createBlog(args);
    },

    updateBlogStatus: async function (_, args) {
      return await updateBlogStatus(args);
    },
  },
};

export * from "./utils";
