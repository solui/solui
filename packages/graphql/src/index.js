import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

import schema from './schema'
import createLinks from './links'

export gql from 'graphql-tag'

export { schema }

const cache = new InMemoryCache()

export const createApolloClient = (uri, clientOptions) => new ApolloClient({
  cache,
  typeDefs: schema,
  link: createLinks({ cache, uri }),
  ...clientOptions,
})
