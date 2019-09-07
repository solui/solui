import { gql } from 'apollo-server-koa'


module.exports = gql`
  scalar DateTime
  scalar JSON

  type User {
    id: ID!
  }

  type Version {
    id: ID!
    title: String!
    description: String!
    data: JSON!
    created: DateTime!
  }

  type Package {
    id: ID!
    name: String!
    author: User!
    created: DateTime!
    versions: [Version]
  }

  type PackageResults {
    packages: [Package]!
    page: Int!
    numPages: Int!
  }

  input SearchCritieraInput {
    keywords: String
    bytecodeHash: String
    page: Int
  }

  type Query {
    search(criteria: SearchCritieraInput!): PackageResults!
    get(idOrName: String!): Package!
  }
`
