import { makeExecutableSchema } from 'graphql-tools'
import { getTypeDefs } from '@solui/graphql'

import createResolvers from './resolvers'

export const createSchema = ({ db, notifier }) => {
  return makeExecutableSchema({
    typeDefs: getTypeDefs(),
    resolvers: createResolvers({ db, notifier }),
  })
}
