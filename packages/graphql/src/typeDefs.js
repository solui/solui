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

  type ErrorDetails {
    code: String
    message: String
  }

  type Error {
    error: ErrorDetails
  }

  union PublishResult = PublishSuccess | Error
  union ProfileResult = User | Error

  input PublishInput {
    spec: JSON!
    artifacts: JSON!
  }

  type AuthToken {
    token: String!
    expires: DateTime!
  }

  type Query {
    getMyPackages: [Package]!
    getMyPackage(id: ID!): Package
    getMyPackageReleases(id: ID!): [Release]!
    getAuthToken(loginToken: String!): AuthToken
    getMyProfile: ProfileResult
  }

  type Mutation {
    publish(bundle: PublishInput!): PublishResult!
    login(challenge: String!, signature: String!, loginToken: String): AuthToken
  }
`

export const getFragmentMatcherConfig = () => ({
  __schema: {
    types: [
      {
        kind: 'UNION',
        name: 'ProfileResult',
        possibleTypes: [
          {
            name: 'User'
          },
          {
            name: 'Error'
          },
        ]
      },
      {
        kind: 'UNION',
        name: 'PublishResult',
        possibleTypes: [
          {
            name: 'PublishSuccess'
          },
          {
            name: 'Error'
          },
        ]
      }
    ]
  }
})
