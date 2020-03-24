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
    id: ID!
    address: EthereumAddress!
  }

  type Release {
    id: ID!
    cid: String!
    title: String!
    description: String!
    created: DateTime!
    bytecodeHashes: [String]!
  }

  type Package {
    id: ID!
    name: String!
    owner: User!
    created: DateTime!
    latestRelease: Release!
  }

  type PackageList {
    packages: [Package]!
  }

  type PublishFinalize {
    finalizeUrl: String!
  }

  type PublishSuccess {
    cid: String!
    url: String!
    shortUrl: String!
  }

  type PublishToChainSuccess {
    dappId: String!
  }

  type ErrorDetails {
    code: String
    message: String
  }

  type Error {
    error: ErrorDetails
  }

  input PublishInput {
    spec: JSON!
    artifacts: JSON!
  }

  input PublishToChainInput {
    cid: String!
    bytecodeHashes: [String!]!
  }

  type AuthToken {
    token: String!
    expires: DateTime!
  }

  type DappChainInfo {
    exists: Boolean!
    numContracts: Int
    publisher: String
    date: DateTime
  }

  union PublishResult = PublishSuccess | PublishFinalize | Error
  union PublishToChainResult = PublishToChainSuccess | Error
  union ProfileResult = User | Error
  union LoginResult = AuthToken | Error
  union PackageResult = Package | Error
  union PackageListResult = PackageList | Error
  union AuthTokenResult = AuthToken | Error
  union DappChainInfoResult = DappChainInfo | Error

  type Query {
    getMyPackages: PackageListResult!
    getPackage(id: ID!): PackageResult!
    getPackageByRelease(id: ID!): PackageResult!
    getAuthToken(loginToken: String!): AuthTokenResult!
    getMyProfile: ProfileResult!
    getDappInfoFromChain(dappId: String!): DappChainInfoResult!
  }

  type Mutation {
    publish(bundle: PublishInput!): PublishResult!
    publishToChain(bundle: PublishToChainInput!): PublishToChainResult!
    login(challenge: String!, signature: String!, loginToken: String): LoginResult!
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
            name: 'PublishFinalize'
          },
          {
            name: 'PublishSuccess'
          },
          {
            name: 'Error'
          },
        ]
      },
      {
        kind: 'UNION',
        name: 'PublishToChainResult',
        possibleTypes: [
          {
            name: 'PublishToChainSuccess'
          },
          {
            name: 'Error'
          },
        ]
      },
      {
        kind: 'UNION',
        name: 'LoginResult',
        possibleTypes: [
          {
            name: 'AuthToken'
          },
          {
            name: 'Error'
          },
        ]
      },
      {
        kind: 'UNION',
        name: 'PackageResult',
        possibleTypes: [
          {
            name: 'Package'
          },
          {
            name: 'Error'
          },
        ]
      },
      {
        kind: 'UNION',
        name: 'PackageListResult',
        possibleTypes: [
          {
            name: 'PackageList'
          },
          {
            name: 'Error'
          },
        ]
      },
      {
        kind: 'UNION',
        name: 'AuthTokenResult',
        possibleTypes: [
          {
            name: 'AuthToken'
          },
          {
            name: 'Error'
          },
        ]
      },
      {
        kind: 'UNION',
        name: 'DappChainInfoResult',
        possibleTypes: [
          {
            name: 'DappChainInfo'
          },
          {
            name: 'Error'
          },
        ]
      },
    ]
  }
})
