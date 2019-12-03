import gql from 'graphql-tag'

/**
 * Get GraphQL type definitions.
 *
 * @return {GraphQLTypeDef}
 */
export const getTypeDefs = () => gql`
  scalar DateTime
  scalar JSON
  scalar EthereumAddress

  type User {
    id: EthereumAddress!
  }

  type Release {
    id: ID!
    cid: String!
    title: String!
    description: String!
    created: DateTime!
  }

  type Package {
    id: ID!
    name: String!
    owner: User!
    created: DateTime!
    latestRelease: Release!
  }

  type PublishSuccess {
    id: ID!
    cid: String!
  }

  type PublishError {
    error: String!
  }

  union PublishResult = PublishSuccess | PublishError

  input PublishInput {
    spec: JSON!
    artifacts: JSON!
  }

  type AuthToken {
    token: String!
    expires: DateTime!
  }

  type Query {
    getMyEntityPackages: [Package]!
    getMyEntityPackage(id: String!): Package
    getMyEntityPackageReleases(id: String!): [Release]!
    getAuthToken(loginToken: String!): AuthToken
    getProfile(address: EthereumAddress!): AuthToken
  }

  type Mutation {
    publish(bundle: PublishInput!): PublishResult!
    login(challenge: String!, signature: String!, loginToken: String!): AuthToken
  }
`
