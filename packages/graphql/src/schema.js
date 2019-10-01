import gql from 'graphql-tag'

export default gql`
  scalar DateTime
  scalar JSON

  type User {
    id: ID!
    username: String!
  }

  type Version {
    id: ID!
    title: String!
    description: String!
    created: DateTime!
    data: JSON!
  }

  type VersionCompact {
    id: ID!
    title: String!
    description: String!
    created: DateTime!
  }

  type Package {
    id: ID!
    name: String!
    author: User!
    created: DateTime!
    latestVersion: VersionCompact!
  }

  type PackageResult {
    id: ID!
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
    versionId: ID
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
    getPackage(name: String!): Package
    getVersion(id: ID!): Version
    getAuthToken(loginToken: String!): AuthToken
  }

  type Mutation {
    publish(bundle: PublishInput!): PublishResult!
    login(email: String!, loginToken: String!): Boolean
  }
`
