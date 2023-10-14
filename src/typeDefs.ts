export const typeDefs = `#graphql
  type Blog {
    _id: ID!
    title: String!
    link: String!
    forOrganisation: String!
    author: Author!
  }

  type Author {
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
  }
`;
