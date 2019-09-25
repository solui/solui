import { _ } from '@solui/utils'

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

export const buildAuthHeaders = token => {
  return token ? {
    Authorization: `Bearer ${token}`
  } : {}
}
