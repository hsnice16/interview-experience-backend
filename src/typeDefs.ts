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

  type Query {
    blogs(limit: Int, offset: Int = 0): [Blog!]!
  }
`;
