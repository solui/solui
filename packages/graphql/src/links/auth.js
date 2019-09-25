import { Observable, ApolloLink } from 'apollo-link'
import {
  hasDirectives,
  checkDocument,
  removeDirectivesFromDocument
} from 'apollo-utilities'

import { buildAuthHeaders } from '../utils'

const sanitizedQueryCache = new Map()

export default ({ authToken }) =>
  new ApolloLink((operation, forward) => {
    const requireAuth = hasDirectives([ 'requireAuth' ], operation.query)
    const disableAuth = hasDirectives([ 'disableAuth' ], operation.query)

    // get sanitized query (remove auth directives since server won't understand them)
    let sanitizedQuery = sanitizedQueryCache[JSON.stringify(operation.query)]
    if (!sanitizedQuery) {
      // remove directives (inspired by https://github.com/apollographql/apollo-link-state/blob/master/packages/apollo-link-state/src/utils.ts)
      checkDocument(operation.query)
      sanitizedQuery = removeDirectivesFromDocument(
        [ { name: 'requireAuth' }, { name: 'disableAuth' } ],
        operation.query
      )
      // save to cache for next time!
      sanitizedQueryCache[JSON.stringify(operation.query)] = sanitizedQuery
    }
    // overwrite original query with sanitized version
    operation.query = sanitizedQuery

    // disable auth for this query?
    if (disableAuth) {
      return forward(operation)
    }

    // build handler
    return new Observable(async observer => {
      // if user is not logged in and we require auth
      if (!authToken.get() && requireAuth) {
        try {
          // login
          await authToken.refresh()
        } catch (err) {
          return observer.error(err)
        }
      }

      // add auth headers if necessary
      if (requireAuth) {
        operation.setContext({
          headers: buildAuthHeaders(authToken.get())
        })
      }

      // pass request down the chain
      const handle = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer)
      })

      // return unsubscribe function
      return () => {
        if (handle) {
          handle.unsubscribe()
        }
      }
    })
  })
