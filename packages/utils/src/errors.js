import { _ } from './lodash'

export const createErrorWithDetails = (msg, details) => {
  const e = new Error(msg)
  e.details = details
  return e
}

export const stringifyGraphqlError = err => {
  const code = _.get(err, 'extensions.exception.code')

  const str = [
    code ? `${err.message} (code: ${code})` : err.message
  ]

  _.get(err, 'networkError.result.errors', []).forEach(e => {
    str.push(stringifyGraphqlError(e))
  })

  return str.join('\n')
}
