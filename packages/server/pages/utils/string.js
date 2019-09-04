import _ from 'lodash'

export const stringifyError = err => {
  const code = _.get(err, 'extensions.exception.code')

  const str = [
    code ? `${err.message} (code: ${code})` : err.message
  ]

  _.get(err, 'networkError.result.errors', []).forEach(e => {
    str.push(stringifyError(e))
  })

  return str.join('\n')
}
