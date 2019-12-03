import { _ } from '@solui/utils'

/**
 * Stringify given GraphQL request error.
 *
 * @param  {*} err Error from GraphQL call.
 * @return {String}
 */
export const stringifyGraphqlError = err => {
  if (Array.isArray(err)) {
    [ err ] = err
  }

  const code = _.get(err, 'extensions.exception.code')

  const str = [
    code ? `${err.message} (code: ${code})` : err.message
  ]

  _.get(err, 'networkError.result.errors', []).forEach(e => {
    str.push(stringifyGraphqlError(e))
  })

  return str.join('\n')
}

/**
 * Build auth headers for sending with GraphpQL requests.
 * @param  {String} token Authentication token
 * @return {Object}       Headers as key-value pairs.
 */
export const buildAuthHeaders = token => {
  return token ? {
    Authorization: `Bearer ${token}`
  } : {}
}
