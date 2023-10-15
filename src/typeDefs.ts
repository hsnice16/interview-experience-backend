export const typeDefs = `#graphql
  type Blog {
    _id: ID!
    title: String!
    link: String!
    forOrganisation: String!
    author: Author!
  }

  type NewBlog {
    _id: ID!
    title: String!
    link: String!
    forOrganisation: String!
    author: Author!
    status: String!
  }

  type Author {
    name: String!
    profile: String!
  }

  input NewAuthor {
    name: String!
    profile: String!
  }

  type Organisation {
    _id: ID!
    name: String!
    blogCount: Int!
  }

  input BlogFilter {
    forOrganisation: String!
  }

  type Query {
    blogs(limit: Int! = 20, offset: Int! = 0, filter: BlogFilter): [Blog!]!
    organisations(limit: Int! = 20, offset: Int! = 0): [Organisation!]!
    stagingBlogs(status: String!): [NewBlog!]!
  }

  type Mutation {
    createBlog(title: String!, link: String!, forOrganisation: String!, author: NewAuthor!): NewBlog!
    updateBlogStatus(_id: ID!, status: String!): NewBlog!
  }
`;
