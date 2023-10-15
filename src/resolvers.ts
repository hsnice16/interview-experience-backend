import { GraphQLError } from "graphql";
import { blogs } from "./db/blogs";
import { organisations } from "./db/organisations";
import { stagingBlogs } from "./db/stagingBlogs";

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
          (blog) =>
            blog.forOrganisation.toLowerCase() ===
            args.filter.forOrganisation.toLowerCase()
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

    stagingBlogs: function (_, args) {
      return stagingBlogs.filter(
        (blog) => blog.status.toLowerCase() === args.status
      );
    },
  },

  Mutation: {
    createBlog: function (_, args) {
      const {
        title,
        link,
        forOrganisation,
        author: { name, profile },
      } = args;

      if (
        blogs.some(
          (blog) =>
            blog.author.name === name &&
            blog.author.profile === profile &&
            blog.forOrganisation.toLowerCase() ===
              forOrganisation.toLowerCase() &&
            blog.link === link &&
            blog.title === title
        )
      ) {
        throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
          extensions: {
            code: CustomErrorCodes.BAD_USER_INPUT,
            argumentName:
              "title, link, forOrganisation, author.name, author.profile",
            reason: "blog with same info already exists",
          },
        });
      }

      const newBlog = {
        _id: `new_blog_00${stagingBlogs.length}`,
        title,
        link,
        forOrganisation,
        author: { name, profile },
        status: "pending",
      };

      stagingBlogs.push(newBlog);
      return newBlog;
    },

    updateBlogStatus: function (_, args) {
      if (stagingBlogs.every((blog) => blog._id !== args._id)) {
        throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
          extensions: {
            code: CustomErrorCodes.BAD_USER_INPUT,
            argumentName: "_id",
            reason: "no blog with the given _id exists",
          },
        });
      }

      if (
        !["approved", "rejected"].includes(args.status.toLowerCase().trim())
      ) {
        throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
          extensions: {
            code: CustomErrorCodes.BAD_USER_INPUT,
            argumentName: "status",
            reason: "status can be approved or rejected only",
          },
        });
      }

      if (args.status === "rejected") {
        const blog = stagingBlogs.find((blog) => blog._id === args._id);
        blog.status = "rejected";

        return blog;
      }

      const blogIndex = stagingBlogs.findIndex((blog) => blog._id === args._id);
      const blog = stagingBlogs.splice(blogIndex, 1)[0];
      const _blog = { ...blog, status: "approved" };
      delete blog.status;
      blogs.push({ ...blog, _id: `blog_00${blogs.length}` });

      const organisation = organisations.find(
        (org) => org.name.toLowerCase() === blog.forOrganisation.toLowerCase()
      );

      if (organisation) {
        organisation.blogCount += 1;
      } else {
        organisations.push({
          _id: `org_00${organisations.length}`,
          name: blog.forOrganisation,
          blogCount: 1,
        });
      }

      return _blog;
    },
  },
};
