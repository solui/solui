import { gql } from 'apollo-server-koa'


module.exports = gql`
  scalar DateTime
  scalar JSON

  type User {
    id: ID!
  }

  type ContractSpec {
    name: String!
    bytecode: String!
  }

  type Spec {
    ui: JSON!
    contracts: [ContractSpec]!
  }

  type Version {
    id: ID!
    title: String!
    description: String!
    spec: Spec!
    created: DateTime!
  }

  type Package {
    id: ID!
    name: String!
    author: User!
    versions: [Version]
  }

  input SearchCritieraInput {
    title: String
    bytecodeHash: String
  }

  type Query {
    search(criteria: SearchCritieraInput!): [Package]!
    get(idOrName: String!): Package!
  }
`
