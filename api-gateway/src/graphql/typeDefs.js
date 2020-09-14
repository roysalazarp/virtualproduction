import { gql } from "apollo-server";

const typeDefs = gql`

  type Scene {
    _id: ID!
    name: String!
    description: String!
    creator: User!
  }

  type User {
    _id: ID!
    email: String!
    password: String
    count: Int
    createdScenes: [Scene!]
  }

  type Token {
    userId: ID!
    accessToken: String!
    tokenExpiration: Int!
  }

  type Query {

    users: [User!]!

    scenes: [Scene!]!

    login(
      email: String!, 
      password: String!
    ): Token!

    me: User
  }

  type Mutation {

    createUser(
      email: String!, 
      password: String!
    ): User!

    createScene(
      name: String!, 
      description: String!
    ): Scene!

    invalidateTokens: Boolean!
  }
  
`;

export default typeDefs;