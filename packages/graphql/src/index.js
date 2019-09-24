import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

import createLinks from './links'

export gql from 'graphql-tag'

const cache = new InMemoryCache()

export const createApolloClient = (uri = '/graphql', clientOptions) => new ApolloClient({
  cache,
  link: createLinks({ cache, uri }),
  ...clientOptions,
})
