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
