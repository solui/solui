import { GraphQLDateTime } from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'

import { LOGIN } from '../notifier/types'


export default ({ db, notifier }) => ({
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
    },
    getAuthToken: (_, { loginToken }) => {
      return db.getAuthToken(loginToken)
    },
  },
  Mutation: {
    login: async (_, { email, loginToken }) => {
      await notifier.sendNotification(LOGIN, { email, loginToken })
    },
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
