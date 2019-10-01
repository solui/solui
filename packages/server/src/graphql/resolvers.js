import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'

import { LOGIN } from '../notifier/types'


export default ({ db, notifier }) => {
  const assertIsLoggedIn = async (ctx = {}) => {
    if (!ctx.uid) {
      throw new Error('Must be logged in')
    }
    return ctx
  }

  return {
    Query: {
      search: async (_, { criteria: { keyword, bytecodeHash, page } }) => {
        if (keyword) {
          return db.searchByKeywords({ keyword, page })
        } else {
          return db.searchByBytecodeHash({ bytecodeHash, page })
        }
      },
      getPackage: (_, { name }) => {
        return db.getPackage({ name })
      },
      getVersion: (_, { id }) => {
        return db.getPackageVersion({ id })
      },
      getAuthToken: (_, { loginToken }) => {
        return db.getAuthToken({ loginToken })
      },
    },
    Mutation: {
      login: async (_, { email, loginToken }) => {
        await notifier.sendNotification(LOGIN, { email, loginToken })
      },
      publish: async (_, { bundle: { spec, artifacts } }, ctx) => {
        await assertIsLoggedIn(ctx)

        try {
          return {
            versionId: await db.publishPackageVersion({ spec, artifacts })
          }
        } catch (err) {
          return { error: err.message }
        }
      }
    },
    DateTime: GraphQLDateTime,
    JSON: GraphQLJSON,
  }
}
