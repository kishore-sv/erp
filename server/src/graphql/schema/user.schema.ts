export const userTypeDefs = `#graphql
  enum UserRole {
    student
    faculty
    parent
    admin
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    isActive: Boolean!
    createdAt: String!
    resetPasswordOtp: String
    resetPasswordOtpExpiry: String
  }

  type Query {
    users(limit: Int): [User!]!
    user(id: ID!): User
  }
`;
