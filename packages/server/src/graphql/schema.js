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
    versions: [Version]
  }

  input SearchCritieraInput {
    keywords: String
    bytecodeHash: String
    page: Integer
  }

  type Query {
    search(criteria: SearchCritieraInput!): [Package]!
    get(idOrName: String!): Package!
  }
`
