import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

import schema from './schema'
import createLinks from './links'
import AuthToken from './authToken'
import { stringifyGraphqlError } from './utils'

export * from './queries'
export * from './mutations'
export * from './fragments'
export * from './utils'

export { schema }

const cache = new InMemoryCache()

export const createApolloClient = ({ serverHost, refreshAuthToken, name, version }) => {
  const authToken = new AuthToken({ refreshAuthToken })

  const client = new ApolloClient({
    cache,
    typeDefs: schema,
    link: createLinks({ cache, serverHost, authToken }),
    name,
    version,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  })

  authToken.s = client

  client.authToken = authToken

  client.safeQuery = async (...args) => {
    try {
      const ret = await client.query(...args)

      if (ret.errors) {
        throw ret.errors
      }

      return ret
    } catch (err) {
      throw new Error(stringifyGraphqlError(err))
    }
  }

  client.safeMutate = async (...args) => {
    try {
      const ret = await client.mutate(...args)

      if (ret.errors) {
        throw ret.errors
      }

      return ret
    } catch (err) {
      throw new Error(stringifyGraphqlError(err))
    }
  }

  return client
}
