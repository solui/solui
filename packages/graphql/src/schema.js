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
    versions: [VersionCompact!]!
  }

  type PackageResult {
    id: ID!
    name: String!
    author: User!
    created: DateTime!
    latestVersion: VersionCompact!
  }

  type PackageResults {
    packages: [PackageResult]!
    page: Int!
    numPages: Int!
  }

  type PublishResult {
    id: ID
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

  type Query {
    search(criteria: SearchCritieraInput!): PackageResults!
    getPackage(name: String!, numVersions: Int!): Package
    getVersion(id: String!): Version
  }

  type Mutation {
    publish(bundle: PublishInput!): PublishResult!
  }
`
