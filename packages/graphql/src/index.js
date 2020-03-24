import { ApolloClient } from 'apollo-client'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'

import { getTypeDefs, getFragmentMatcherConfig } from './typeDefs'
import createLinks from './links'
import AuthToken from './authToken'
import { stringifyError, resolveError } from './errors'

export * from './scalars'
export * from './queries'
export * from './mutations'
export * from './fragments'
export * from './utils'
export * from './resolvers'
export * from './errors'

export { getTypeDefs }

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: getFragmentMatcherConfig()
})

const cache = new InMemoryCache({ fragmentMatcher })

/**
 * Create a new [Apollo](https://www.apollographql.com/) GraphQL client for talking to the solUI API.
 *
 * @param  {String} endpoint         Server graphql endpoint.
 * @param  {Object} authTokenImplementation Auth token manager implementation.
 * @param  {String} name             Client name (to identify itself to server)
 * @param  {String} version          Client version.
 *
 * @return {ApolloClient}
 */
export const createApolloClient = ({ endpoint, authTokenImplementation, name, version, ...extraClientOptions }) => {
  const authToken = new AuthToken(authTokenImplementation)

  const client = new ApolloClient({
    cache,
    typeDefs: getTypeDefs(),
    link: createLinks({ cache, endpoint, authToken }),
    name,
    version,
    ...extraClientOptions,
  })

  client.authToken = authToken

  client.safeQuery = async (...args) => {
    let ret
    let error

    try {
      ret = await client.query(...args)
    } catch (err) {
      error = err
    }

    if (!error) {
      error = resolveError(ret)
    }

    if (error) {
      const e = new Error(stringifyError(error))
      e.code = error.code
      throw e
    }

    return ret
  }

  client.safeMutate = async (...args) => {
    let ret
    let error

    try {
      ret = await client.mutate(...args)
    } catch (err) {
      error = err
    }

    if (!error) {
      error = resolveError(ret)
    }

    if (error) {
      const e = new Error(stringifyError(error))
      e.code = error.code
      throw e
    }

    return ret
  }

  return client
}
