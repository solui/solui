import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

import createLinks from './links'

const cache = new InMemoryCache()

export const client = new ApolloClient({
  cache,
  link: createLinks({ cache }),
})
