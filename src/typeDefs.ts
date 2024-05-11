export const typeDefs = `#graphql
  type Blog {
    _id: ID!
    title: String!
    link: String!
    forOrganization: String!
    author: Author!
  }

  type NewBlog {
    _id: ID!
    title: String!
    link: String!
    forOrganization: String!
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

  type Organization {
    _id: ID!
    name: String!
    blogCount: Int!
  }

  input BlogFilter {
    forOrganization: String!
    searchKeywords: [String!]!
  }

  type Query {
    blogs(limit: Int! = 20, offset: Int! = 0, filter: BlogFilter): [Blog!]!
    organizations(limit: Int! = 1000, offset: Int! = 0): [Organization!]!
    stagingBlogs(messageCode: String!, status: String!): [NewBlog!]!
  }

  type Mutation {
    createBlog(messageCode: String!, title: String!, link: String!, forOrganization: String!, author: NewAuthor!): NewBlog!
    updateBlogStatus(messageCode: String!, _id: ID!, status: String!): NewBlog!
  }
`;
