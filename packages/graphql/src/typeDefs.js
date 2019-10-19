import gql from 'graphql-tag'

export const getTypeDefs = () => gql`
  scalar DateTime
  scalar JSON

  type User {
    id: ID!
    username: String!
  }

  type Version {
    id: String!
    title: String!
    description: String!
    created: DateTime!
    data: JSON!
  }

  type VersionCompact {
    id: String!
    title: String!
    description: String!
    created: DateTime!
  }

  type Package {
    id: String!
    author: User!
    created: DateTime!
    latestVersion: VersionCompact!
  }

  type PackageResult {
    id: String!
    name: String!
    author: User!
    created: DateTime!
    version: VersionCompact!
  }

  type SearchResults {
    packages: [PackageResult]!
    page: Int!
    totalResults: Int!
    numPages: Int!
  }

  type PublishResult {
    versionId: String
    error: String
  }

  input SearchCritieraInput {
    keyword: String
    bytecodeHash: String
    page: Int
  }

  input PublishInput {
    spec: JSON!
    artifacts: JSON!
  }

  type AuthToken {
    token: String!
    expires: DateTime!
  }

  type Query {
    search(criteria: SearchCritieraInput!): SearchResults!
    getPackage(id: String!): Package
    getVersion(id: String!): Version
    getAuthToken(loginToken: String!): AuthToken
  }

  type Mutation {
    publish(bundle: PublishInput!): PublishResult!
    login(email: String!, loginToken: String!): Boolean
  }
`
