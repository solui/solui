const errors = {
  ERROR_CODE_UNKNOWN: 'There was an unexpected error.',
  ERROR_CODE_NOT_LOGGED_IN: 'You must be logged in.',
  ERROR_NOT_FOUND: 'Not found.',
}

Object.keys(errors).forEach(id => {
  exports[id] = id
})

exports.createErrorResponse = (code = exports.ERROR_CODE_UNKNOWN, message) => {
  return {
    error: {
      code,
      message: message || errors[code],
    }
  }
}
