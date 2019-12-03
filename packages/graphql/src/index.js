import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { getTypeDefs } from './typeDefs'
import createLinks from './links'
import AuthToken from './authToken'
import { stringifyGraphqlError } from './utils'

export * from './scalars'
export * from './queries'
export * from './mutations'
export * from './fragments'
export * from './utils'
export * from './resolvers'

export { getTypeDefs }

const cache = new InMemoryCache()

/**
 * Create a new [Apollo](https://www.apollographql.com/) GraphQL client for talking to the solUI API.
 *
 * @param  {String} endpoint         Server graphql endpoint.
 * @param  {Function} refreshAuthToken Callback for refreshing auth token.
 * @param  {String} name             Client name (to identify itself to server)
 * @param  {String} version          Client version.
 *
 * @return {ApolloClient}
 */
export const createApolloClient = ({ endpoint, refreshAuthToken, name, version }) => {
  const authToken = new AuthToken({ refreshAuthToken })

  const client = new ApolloClient({
    cache,
    typeDefs: getTypeDefs(),
    link: createLinks({ cache, endpoint, authToken }),
    name,
    version,
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
