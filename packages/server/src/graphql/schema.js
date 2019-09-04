import { gql } from 'apollo-server-koa'


module.exports = gql`
  scalar DateTime
  scalar JSON

  enum LocationType {
    ONSITE
    REMOTE_LIMITED
    REMOTE_ANYWHERE
  }

  enum ApplyMethod {
    URL
    EMAIL
  }

  type Apply {
    method: ApplyMethod!
    link: String!
    instructions: String
  }

  input ApplyInput {
    method: ApplyMethod!
    link: String!
    instructions: String
  }

  type Company {
    id: ID!
    name: String!
    description: String!
    url: String!
    logoImg: String
  }

  input CompanyInput {
    id: ID
    name: String!
    description: String!
    url: String!
    logoImg: String
  }

  type Location {
    type: LocationType!
    name: String
  }

  input LocationInput {
    type: LocationType!
    name: String
  }

  input TagInput {
    id: ID!
    text: String!
  }

  type Job {
    id: ID!
    title: String!
    slug: String!
    absoluteUrl: String!
    description: String!
    posted: DateTime
    expiry: DateTime
    location: Location!
    apply: Apply!
    company: Company!
    blockchain: String!
    tags: [String]
    scraped: Boolean
  }

  input CreateJobInput {
    title: String!
    description: String!
    company: CompanyInput!
    location: LocationInput!
    blockchain: [TagInput!]!
    tags: [TagInput]!
    apply: ApplyInput!
    adminEmail: String!
  }

  input UpdatedJobInput {
    title: String!
    description: String!
    company: CompanyInput!
    location: LocationInput!
    blockchain: [TagInput!]!
    tags: [TagInput]!
    apply: ApplyInput!
  }

  type Query {
    myOwnJobs: [Job]!
    jobs(onlyActive: Boolean!): [Job]!
    job(id: ID, slug: String): Job
    companies: [Company]!
  }

  type Mutation {
    createJob(job: CreateJobInput!): Job!
    publishJob(id: ID!, token: JSON!, weeks: Int!, updatedDetails: UpdatedJobInput!): Job!
    publishJobAsAdmin(id: ID!, weeks: Int!, updatedDetails: UpdatedJobInput!): Job!
    login(email: String!): Boolean
  }
`
