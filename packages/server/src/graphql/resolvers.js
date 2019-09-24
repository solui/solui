import { GraphQLDateTime } from 'graphql-iso-date'

const GraphQLJSON = require('graphql-type-json')


export default ({ db }) => ({
  Query: {
    search: async (_, { criteria: { keyword, bytecodeHash, page } }) => {
      if (keyword) {
        return db.searchByKeywords(keyword, page)
      } else {
        return db.searchByBytecodeHash(bytecodeHash, page)
      }
    },
    getPackage: (_, { name, numVersions }) => {
      return db.getPackage(name, numVersions)
    },
    getVersion: (_, { id }) => {
      return db.getPackageVersion(id)
    }
  },
  Mutation: {
    publish: async (_, { bundle: { spec, artifacts } }) => {
      try {
        return {
          versionId: await db.publishPackageVersion(spec, artifacts)
        }
      } catch (err) {
        return { error: err.message }
      }
    }
  },
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
})
