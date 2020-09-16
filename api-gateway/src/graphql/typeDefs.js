import { gql } from "apollo-server";

const typeDefs = gql`

  type Booking {
    _id: ID!
    scene: Scene
    user: UserFilmmaker!
    createdAt: String!
    updatedAt: String!
  }

  type Scene {
    _id: ID!
    name: String!
    description: String!
    creator: User3dartist!
  }

  type User3dartist {
    _id: ID!
    email: String!
    password: String
    count: Int
    createdScenes: [Scene!]
  }

  type UserFilmmaker {
    _id: ID!
    email: String!
    password: String
    count: Int
    bookedScenes: [Booking!]
  }

  type TokenFilmmaker {
    userIdFilmmaker: ID!
    accessTokenFilmmaker: String!
    tokenExpirationFilmmaker: Int!
  }

  type Token3Dartist {
    userId3Dartist: ID!
    accessToken3Dartist: String!
    tokenExpiration3Dartist: Int!
  }

  type Query {

    users3dartists: [User3dartist!]!
    usersFilmmaker: [UserFilmmaker!]!
    bookings: [Booking!]!

    scenes: [Scene!]!

    login3Dartist(
      email: String!, 
      password: String!
    ): Token3Dartist!

    loginFilmmaker(
      email: String!, 
      password: String!
    ): TokenFilmmaker!

    me3Dartist: User3dartist
    meFilmmaker: UserFilmmaker
  }

  type Mutation {

    createUser3dartist(
      email: String!, 
      password: String!
    ): User3dartist!

    createUserFilmmaker(
      email: String!, 
      password: String!
    ): UserFilmmaker!

    createScene(
      name: String!, 
      description: String!
    ): Scene!

    bookScene(
      sceneId: ID!, 
    ): Booking!

    cancelBooking(
      bookingId: ID!, 
    ): Scene!

    invalidateTokens3Dartist: Boolean!
    invalidateTokensFilmmaker: Boolean!
  }
  
`;

export default typeDefs;