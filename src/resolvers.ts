import { GraphQLError } from "graphql";
import { blogs } from "./db/blogs";
import { organizations } from "./db/organizations";
import { stagingBlogs } from "./db/stagingBlogs";
import { logger } from "./utils";
import { JSEncrypt } from "nodejs-jsencrypt";

export enum CustomErrorCodes {
  BAD_USER_INPUT = "BAD_USER_INPUT",
  UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS",
  INVALID_MESSAGE_CODE = "INVALID_MESSAGE_CODE",
}

export const errorMsgs = {
  [CustomErrorCodes.BAD_USER_INPUT]: "Invalid argument value",
  [CustomErrorCodes.UNAUTHORIZED_ACCESS]: "Not authorized to use",
  [CustomErrorCodes.INVALID_MESSAGE_CODE]: "Message code is invalid",
};

function checkLimitValue(limit?: number) {
  logger("Check for limit value started!");

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
  logger("Check for offset value started!");

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

function checkAuthorization(messageCode: string) {
  logger("Check for Authorization started!");

  if (messageCode) {
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(process.env.RSA_PRIVATE_KEY);
    const message = decrypt.decrypt(messageCode);

    if (message !== process.env.MESSAGE_CODE) {
      throw new GraphQLError(errorMsgs[CustomErrorCodes.INVALID_MESSAGE_CODE], {
        extensions: {
          code: CustomErrorCodes.INVALID_MESSAGE_CODE,
        },
      });
    }
  } else {
    throw new GraphQLError(errorMsgs[CustomErrorCodes.UNAUTHORIZED_ACCESS], {
      extensions: {
        code: CustomErrorCodes.UNAUTHORIZED_ACCESS,
      },
    });
  }
}

export const resolvers = {
  Query: {
    blogs: function (_, args) {
      if (args.filter?.forOrganization) {
        logger("Blogs query return for given forOrganization started!");

        return blogs.filter(
          (blog) =>
            blog.forOrganization.toLowerCase() ===
            args.filter.forOrganization.toLowerCase()
        );
      }

      checkLimitValue(args.limit);
      checkOffsetValue(args.offset);

      logger("Blogs query return in range [offset, offset + limit) started!");

      return blogs.slice(args.offset, args.offset + args.limit);
    },

    organizations: function (_, args) {
      checkLimitValue(args.limit);
      checkOffsetValue(args.offset);

      logger(
        "Organizations query return in range [offset, offset + limit) started!"
      );

      return organizations.slice(args.offset, args.offset + args.limit);
    },

    stagingBlogs: function (_, args) {
      checkAuthorization(args.messageCode);

      logger("Staging blogs query return for given status started!");

      return stagingBlogs.filter(
        (blog) => blog.status.toLowerCase() === args.status
      );
    },
  },

  Mutation: {
    createBlog: function (_, args) {
      const {
        messageCode,
        title,
        link,
        forOrganization,
        author: { name, profile },
      } = args;
      checkAuthorization(messageCode);

      logger("Check for if blog exists started!");

      if (
        blogs.some(
          (blog) =>
            blog.author.name === name &&
            blog.author.profile === profile &&
            blog.forOrganization.toLowerCase() ===
              forOrganization.toLowerCase() &&
            blog.link === link &&
            blog.title === title
        )
      ) {
        throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
          extensions: {
            code: CustomErrorCodes.BAD_USER_INPUT,
            argumentName:
              "title, link, forOrganization, author.name, author.profile",
            reason: "blog with same info already exists",
          },
        });
      }

      const newBlog = {
        _id: `new_blog_00${stagingBlogs.length}`,
        title,
        link,
        forOrganization,
        author: { name, profile },
        status: "pending",
      };

      stagingBlogs.push(newBlog);

      logger("Create blog return started!");

      return newBlog;
    },

    updateBlogStatus: function (_, args) {
      checkAuthorization(args.messageCode);

      logger("Check for if blog doesn't exist started!");

      if (stagingBlogs.every((blog) => blog._id !== args._id)) {
        throw new GraphQLError(errorMsgs[CustomErrorCodes.BAD_USER_INPUT], {
          extensions: {
            code: CustomErrorCodes.BAD_USER_INPUT,
            argumentName: "_id",
            reason: "no blog with the given _id exists",
          },
        });
      }

      logger("Check for if given status is not approved or rejected started!");

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

        logger("Update blog status return if status is rejected started!");

        return blog;
      }

      logger("Find for the blog in stagingBlogs started!");

      const blogIndex = stagingBlogs.findIndex((blog) => blog._id === args._id);
      const blog = stagingBlogs.splice(blogIndex, 1)[0];
      const _blog = { ...blog, status: "approved" };
      delete blog.status;
      blogs.push({ ...blog, _id: `blog_00${blogs.length}` });

      logger(
        "Find for the new blog forOrganizations in organizations started!"
      );

      const organization = organizations.find(
        (org) => org.name.toLowerCase() === blog.forOrganization.toLowerCase()
      );

      if (organization) {
        organization.blogCount += 1;
      } else {
        organizations.push({
          _id: `org_00${organizations.length}`,
          name: blog.forOrganization,
          blogCount: 1,
        });
      }

      logger("Update blog status return if status is approved started!");

      return _blog;
    },
  },
};
