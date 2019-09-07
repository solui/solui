import { GraphQLDateTime } from 'graphql-iso-date'

const GraphQLJSON = require('graphql-type-json')


export default ({ db }) => ({
  Query: {
    search: async (_, { criteria: { keywords, bytecodeHash, page } }) => {
      if (keywords) {
        return db.searchByKeywords(keywords, page)
      } else {
        return db.searchByBytecodeHash(bytecodeHash, page)
      }
    },
  },
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
})
