import { GraphQLDateTime } from 'graphql-iso-date'

const GraphQLJSON = require('graphql-type-json')


export default ({ config, db }) => {
  const assertIsLoggedIn = async (ctx = {}) => {
    if (!ctx.uid) {
      throw new Error('Must be logged in')
    }
    return ctx
  }

  const assertIsAdmin = async (ctx = {}) => {
    const { isAdmin } = await assertIsLoggedIn(ctx)
    if (!isAdmin) {
      throw new Error('Must be admin')
    }
    return ctx
  }

  return {
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
  }
}
